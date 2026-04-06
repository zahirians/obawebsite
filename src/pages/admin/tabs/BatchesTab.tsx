import { FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadPublicImage } from "@/lib/upload";

type Row = {
  id: string;
  slug: string;
  logo_url: string | null;
  official_title: string | null;
  custom_title: string | null;
  ol_year: number | null;
  al_year: number | null;
  description: string | null;
  exco_photo_url: string | null;
};

export function BatchesTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [officialTitle, setOfficialTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [olYear, setOlYear] = useState("");
  const [alYear, setAlYear] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [excoUrl, setExcoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [excoFile, setExcoFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("batches").select("*").order("al_year", { ascending: false, nullsFirst: false });
    setRows((data as Row[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startNew() {
    setEditingId(null);
    setSlug("");
    setOfficialTitle("");
    setCustomTitle("");
    setOlYear("");
    setAlYear("");
    setDescription("");
    setLogoUrl("");
    setExcoUrl("");
    setLogoFile(null);
    setExcoFile(null);
    setMsg("");
  }

  function startEdit(r: Row) {
    setEditingId(r.id);
    setSlug(r.slug);
    setOfficialTitle(r.official_title ?? "");
    setCustomTitle(r.custom_title ?? "");
    setOlYear(r.ol_year != null ? String(r.ol_year) : "");
    setAlYear(r.al_year != null ? String(r.al_year) : "");
    setDescription(r.description ?? "");
    setLogoUrl(r.logo_url ?? "");
    setExcoUrl(r.exco_photo_url ?? "");
    setLogoFile(null);
    setExcoFile(null);
    setMsg("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      let nextLogo = logoUrl;
      let nextExco = excoUrl;
      if (logoFile) nextLogo = await uploadPublicImage(logoFile, "batches/logos");
      if (excoFile) nextExco = await uploadPublicImage(excoFile, "batches/exco");
      const payload = {
        slug: slug.trim(),
        official_title: officialTitle || null,
        custom_title: customTitle || null,
        ol_year: olYear ? parseInt(olYear, 10) : null,
        al_year: alYear ? parseInt(alYear, 10) : null,
        description: description || null,
        logo_url: nextLogo || null,
        exco_photo_url: nextExco || null,
      };
      if (!payload.slug) {
        setMsg("Slug required.");
        return;
      }
      if (editingId) {
        const { error } = await supabase.from("batches").update(payload).eq("id", editingId);
        if (error) throw error;
        setMsg("Updated.");
      } else {
        const { error } = await supabase.from("batches").insert(payload);
        if (error) throw error;
        setMsg("Created.");
      }
      setLogoFile(null);
      setExcoFile(null);
      void load();
      startNew();
    } catch (err) {
      console.error(err);
      setMsg("Error saving.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete batch and its projects?")) return;
    const { error } = await supabase.from("batches").delete().eq("id", id);
    if (error) console.error(error);
    void load();
    if (editingId === id) startNew();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-brand-blue">Batches</h2>
      <form onSubmit={onSave} className="mt-6 max-w-xl space-y-3 rounded border border-brand-gray bg-white p-4">
        <p className="text-sm font-semibold text-brand-blue">{editingId ? "Edit batch" : "New batch"}</p>
        <input required placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <input placeholder="Official title (e.g. Batch of 2009)" value={officialTitle} onChange={(e) => setOfficialTitle(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <input placeholder="Custom display title" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <input placeholder="O/L year" value={olYear} onChange={(e) => setOlYear(e.target.value)} className="w-1/2 rounded border border-brand-gray px-3 py-2 text-sm" />
          <input placeholder="A/L year" value={alYear} onChange={(e) => setAlYear(e.target.value)} className="w-1/2 rounded border border-brand-gray px-3 py-2 text-sm" />
        </div>
        <textarea placeholder="Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <p className="text-xs font-bold uppercase text-brand-blue/70">Logo</p>
        {logoUrl && <img src={logoUrl} alt="" className="h-16 object-contain" />}
        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
        <p className="text-xs font-bold uppercase text-brand-blue/70">ExCo photo</p>
        {excoUrl && <img src={excoUrl} alt="" className="h-24 object-cover rounded" />}
        <input type="file" accept="image/*" onChange={(e) => setExcoFile(e.target.files?.[0] ?? null)} />
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-brand-maroon px-6 py-2 text-sm font-bold uppercase text-white">Save</button>
          <button type="button" onClick={startNew} className="rounded-full border border-brand-gray px-4 py-2 text-sm">Clear</button>
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <ul className="mt-8 space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded border border-brand-gray bg-white px-4 py-3">
            <span className="font-medium text-brand-blue">{r.custom_title || r.official_title || r.slug}</span>
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
