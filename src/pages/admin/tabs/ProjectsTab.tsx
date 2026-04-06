import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadPublicImage } from "@/lib/upload";

type ParentKind = "branch" | "batch" | "association";

type Opt = { id: string; label: string };

export function ProjectsTab() {
  const [kind, setKind] = useState<ParentKind>("branch");
  const [parents, setParents] = useState<Opt[]>([]);
  const [parentId, setParentId] = useState("");
  const [projects, setProjects] = useState<
    { id: string; title: string; description: string | null; image_url: string | null; link_url: string | null; sort_order: number | null }[]
  >([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const fkField = useMemo(() => {
    if (kind === "branch") return "branch_id";
    if (kind === "batch") return "batch_id";
    return "association_id";
  }, [kind]);

  const loadParents = useCallback(async () => {
    setParentId("");
    if (kind === "branch") {
      const { data } = await supabase.from("branches").select("id,name").order("name");
      setParents((data ?? []).map((r: { id: string; name: string }) => ({ id: r.id, label: r.name })));
    } else if (kind === "batch") {
      const { data } = await supabase.from("batches").select("id,custom_title,official_title,slug").order("al_year", { ascending: false, nullsFirst: false });
      setParents(
        (data ?? []).map((r: { id: string; custom_title: string | null; official_title: string | null; slug: string }) => ({
          id: r.id,
          label: r.custom_title || r.official_title || r.slug,
        }))
      );
    } else {
      const { data } = await supabase.from("associations").select("id,name").order("name");
      setParents((data ?? []).map((r: { id: string; name: string }) => ({ id: r.id, label: r.name })));
    }
  }, [kind]);

  const loadProjects = useCallback(async () => {
    if (!parentId) {
      setProjects([]);
      return;
    }
    let q = supabase.from("projects").select("*").order("sort_order");
    if (fkField === "branch_id") q = q.eq("branch_id", parentId);
    else if (fkField === "batch_id") q = q.eq("batch_id", parentId);
    else q = q.eq("association_id", parentId);
    const { data } = await q;
    setProjects((data as typeof projects) ?? []);
  }, [parentId, fkField]);

  useEffect(() => {
    void loadParents();
  }, [loadParents]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  function startNew() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setLinkUrl("");
    setSortOrder("0");
    setImageUrl("");
    setFile(null);
    setMsg("");
  }

  function startEdit(p: (typeof projects)[0]) {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description ?? "");
    setLinkUrl(p.link_url ?? "");
    setSortOrder(String(p.sort_order ?? 0));
    setImageUrl(p.image_url ?? "");
    setFile(null);
    setMsg("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!parentId) {
      setMsg("Select a parent.");
      return;
    }
    try {
      let url = imageUrl;
      if (file) url = await uploadPublicImage(file, "projects");
      const base = {
        title: title.trim(),
        description: description || null,
        link_url: linkUrl || null,
        image_url: url || null,
        sort_order: sortOrder ? parseInt(sortOrder, 10) : 0,
        branch_id: kind === "branch" ? parentId : null,
        batch_id: kind === "batch" ? parentId : null,
        association_id: kind === "association" ? parentId : null,
      };
      if (!base.title) {
        setMsg("Title required.");
        return;
      }
      if (editingId) {
        const { error } = await supabase.from("projects").update(base).eq("id", editingId);
        if (error) throw error;
        setMsg("Updated.");
      } else {
        const { error } = await supabase.from("projects").insert(base);
        if (error) throw error;
        setMsg("Created.");
      }
      setFile(null);
      void loadProjects();
      startNew();
    } catch (err) {
      console.error(err);
      setMsg("Error saving.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) console.error(error);
    void loadProjects();
    if (editingId === id) startNew();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-brand-blue">Projects</h2>
      <p className="mt-2 text-sm text-brand-blue/80">
        Link projects to a branch, batch, or association.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="text-sm font-semibold text-brand-blue">
          Parent type
          <select value={kind} onChange={(e) => setKind(e.target.value as ParentKind)} className="ml-2 rounded border border-brand-gray px-2 py-1">
            <option value="branch">Branch</option>
            <option value="batch">Batch</option>
            <option value="association">Association</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-brand-blue">
          Parent
          <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="ml-2 max-w-xs rounded border border-brand-gray px-2 py-1">
            <option value="">— Select —</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <form onSubmit={onSave} className="mt-6 max-w-xl space-y-3 rounded border border-brand-gray bg-white p-4">
        <p className="text-sm font-semibold text-brand-blue">{editingId ? "Edit project" : "New project"}</p>
        <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <textarea placeholder="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <input placeholder="Link URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        <input placeholder="Sort order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full rounded border border-brand-gray px-3 py-2 text-sm" />
        {imageUrl && <img src={imageUrl} alt="" className="h-24 rounded object-cover" />}
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-brand-maroon px-6 py-2 text-sm font-bold uppercase text-white">Save</button>
          <button type="button" onClick={startNew} className="rounded-full border border-brand-gray px-4 py-2 text-sm">Clear</button>
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <ul className="mt-8 space-y-2">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded border border-brand-gray bg-white px-4 py-3">
            <span className="font-medium text-brand-blue">{p.title}</span>
            <div className="flex gap-2">
              <button type="button" className="text-sm font-semibold text-brand-maroon" onClick={() => startEdit(p)}>Edit</button>
              <button type="button" className="text-sm text-red-700" onClick={() => void onDelete(p.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
