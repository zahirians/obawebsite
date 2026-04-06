import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadPublicImage } from "@/lib/upload";

export function HighlightTab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonHref, setButtonHref] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const { data } = await supabase
      .from("home_highlight")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (data) {
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setButtonLabel(data.button_label ?? "");
      setButtonHref(data.button_href ?? "");
      setImageUrl(data.image_url ?? "");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      let nextUrl = imageUrl;
      if (file) {
        nextUrl = await uploadPublicImage(file, "highlight");
      }
      const { error } = await supabase
        .from("home_highlight")
        .update({
          title,
          description,
          button_label: buttonLabel,
          button_href: buttonHref,
          image_url: nextUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);
      if (error) throw error;
      setImageUrl(nextUrl);
      setFile(null);
      setMsg("Saved.");
      void load();
    } catch (err) {
      console.error(err);
      setMsg("Error saving.");
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-brand-blue">
        Home — membership highlight
      </h2>
      <form onSubmit={onSave} className="mt-6 max-w-xl space-y-4">
        <label className="block text-xs font-bold uppercase text-brand-blue/70">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-brand-gray px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-bold uppercase text-brand-blue/70">
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded border border-brand-gray px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-bold uppercase text-brand-blue/70">
          Button label
          <input
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            className="mt-1 w-full rounded border border-brand-gray px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-bold uppercase text-brand-blue/70">
          Button link (path)
          <input
            value={buttonHref}
            onChange={(e) => setButtonHref(e.target.value)}
            className="mt-1 w-full rounded border border-brand-gray px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-bold uppercase text-brand-blue/70">
          Image
          {imageUrl && (
            <img src={imageUrl} alt="" className="mt-2 h-32 rounded object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-brand-maroon px-6 py-2 text-sm font-bold uppercase text-white"
        >
          Save
        </button>
        {msg && <p className="text-sm text-brand-blue">{msg}</p>}
      </form>
    </div>
  );
}
