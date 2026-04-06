import { FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadPublicImage } from "@/lib/upload";

type Row = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  exco_photo_url: string | null;
};

export function AssociationsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("associations").select("*").order("name");
    setRows((data as Row[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startNew() {
    setEditingId(null);
    setSlug("");
    setName("");
    setDescription("");
    setPhotoUrl("");
    setFile(null);
    setMsg("");
  }

  function startEdit(r: Row) {
    setEditingId(r.id);
    setSlug(r.slug);
    setName(r.name);
    setDescription(r.description ?? "");
    setPhotoUrl(r.exco_photo_url ?? "");
    setFile(null);
    setMsg("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      let url = photoUrl;
      if (file) url = await uploadPublicImage(file, "associations");
      const payload = {
        slug: slug.trim(),
        name: name.trim(),
        description: description || null,
        exco_photo_url: url || null,
      };
      if (!payload.slug || !payload.name) {
        setMsg("Slug and name required.");
        return;
      }
      if (editingId) {
        const { error } = await supabase.from("associations").update(payload).eq("id", editingId);
        if (error) throw error;
        setMsg("Updated.");
      } else {
        const { error } = await supabase.from("associations").insert(payload);
        if (error) throw error;
        setMsg("Created.");
      }
      setFile(null);
      void load();
      startNew();
    } catch (err) {
      console.error(err);
      setMsg("Error saving.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete association and its projects?")) return;
    const { error } = await supabase.from("associations").delete().eq("id", id);
    if (error) console.error(error);
    void load();
    if (editingId === id) startNew();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-brand-blue">Associations</h2>
      <form onSubmit={onSave} className="mt-6 max-w-xl space-y-3 rounded border border-brand-gray bg-white p-4">
        <p className="text-sm font-semibold text-brand-blue">{editingId ? "Edit association" : "New association"}</p>
        <input required placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <textarea placeholder="Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        {photoUrl && <img src={photoUrl} alt="" className="h-24 rounded object-cover" />}
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-brand-maroon px-6 py-2 text-sm font-bold uppercase text-white">Save</button>
          <button type="button" onClick={startNew} className="rounded-full border border-brand-gray px-4 py-2 text-sm">Clear</button>
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <ul className="mt-8 space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded border border-brand-gray bg-white px-4 py-3">
            <span className="font-medium text-brand-blue">{r.name}</span>
            <div className="flex gap-2">
              <button type="button" className="text-sm font-semibold text-brand-maroon" onClick={() => startEdit(r)}>Edit</button>
              <button type="button" className="text-sm text-red-700" onClick={() => void onDelete(r.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
