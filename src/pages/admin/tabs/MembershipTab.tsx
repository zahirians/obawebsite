import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function MembershipTab() {
  const [summary, setSummary] = useState("");
  const [benefitsMd, setBenefitsMd] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    void supabase
      .from("membership_content")
      .select("summary,benefits_md")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        setSummary(data?.summary ?? "");
        setBenefitsMd(data?.benefits_md ?? "");
      });
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase
      .from("membership_content")
      .update({
        summary,
        benefits_md: benefitsMd,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) {
      console.error(error);
      setMsg("Error saving.");
    } else {
      setMsg("Saved.");
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-brand-blue">
        Membership page
      </h2>
      <form onSubmit={onSave} className="mt-6 max-w-2xl space-y-4">
        <label className="block text-xs font-bold uppercase text-brand-blue/70">
          Summary
          <textarea
            rows={5}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="mt-1 w-full rounded border border-brand-gray px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-bold uppercase text-brand-blue/70">
          Benefits (plain text or line breaks)
          <textarea
            rows={8}
            value={benefitsMd}
            onChange={(e) => setBenefitsMd(e.target.value)}
            className="mt-1 w-full rounded border border-brand-gray px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-brand-maroon px-6 py-2 text-sm font-bold uppercase text-white"
        >
          Save
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
