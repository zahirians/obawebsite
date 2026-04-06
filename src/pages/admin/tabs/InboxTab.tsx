import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Row = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string | null;
};

export function InboxTab() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setRows((data as Row[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-brand-blue">Contact inbox</h2>
      <p className="mt-2 text-sm text-brand-blue/80">Latest messages from the contact form.</p>
      <ul className="mt-6 space-y-4">
        {rows.length === 0 && <li className="text-sm text-brand-blue/60">No messages yet.</li>}
        {rows.map((r) => (
          <li key={r.id} className="rounded border border-brand-gray bg-white p-4">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="font-semibold text-brand-blue">{r.name}</span>
              <a href={`mailto:${r.email}`} className="text-brand-maroon">{r.email}</a>
            </div>
            <time className="mt-1 block text-xs text-brand-blue/50">
              {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
            </time>
            <p className="mt-3 whitespace-pre-line text-sm text-brand-blue/90">{r.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
