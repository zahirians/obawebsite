import { FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import { uploadPublicImage } from "@/lib/upload";

type Row = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published_at: string | null;
};

export function NewsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("news")
      .select("id,title,description,image_url,published_at")
      .order("published_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      let imageUrl: string | null = null;
      if (file) imageUrl = await uploadPublicImage(file, "news");
      const finalSlug = slug.trim() || slugify(title) || null;
      const { error } = await supabase.from("news").insert({
        title,
        description: description || null,
        image_url: imageUrl,
        slug: finalSlug,
        published_at: new Date().toISOString(),
      });
      if (error) throw error;
      setTitle("");
      setDescription("");
      setSlug("");
      setFile(null);
      setMsg("Created.");
      void load();
    } catch (err) {
      console.error(err);
      setMsg("Error creating news.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) console.error(error);
    void load();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-brand-blue">News</h2>
      <form onSubmit={onCreate} className="mt-6 max-w-xl space-y-3 rounded border bg-white p-4 border-brand-gray">
        <p className="text-sm font-semibold text-brand-blue">New article</p>
        <input
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-brand-gray px-3 py-2 text-sm"
        />
        <input
          placeholder="Slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded border border-brand-gray px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-brand-gray px-3 py-2 text-sm"
        />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="submit" className="rounded-full bg-brand-blue px-6 py-2 text-sm font-bold uppercase text-white">
          Publish
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <ul className="mt-8 space-y-3">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex items-start justify-between gap-4 rounded border border-brand-gray bg-white p-4"
          >
            <div>
              <p className="font-semibold text-brand-blue">{r.title}</p>
              <p className="text-xs text-brand-blue/60">
                {r.published_at
                  ? new Date(r.published_at).toLocaleString()
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void onDelete(r.id)}
              className="shrink-0 text-xs font-bold uppercase text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
