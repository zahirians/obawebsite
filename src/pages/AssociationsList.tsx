import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Row = { id: string; slug: string; name: string };

export function AssociationsListPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    void supabase
      .from("associations")
      .select("id,slug,name")
      .order("name")
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-maroon">
        Alumni · Associations
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-brand-blue">
        Associations
      </h1>
      <p className="mt-4 max-w-2xl text-brand-blue/85">
        Association pages include descriptions, executive committee photos, and
        projects.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.length === 0 && (
          <li className="text-sm text-brand-blue/60 col-span-full">
            No associations yet — add them in the admin console.
          </li>
        )}
        {rows.map((a) => (
          <li key={a.id}>
            <Link
              to={`/alumni/associations/${a.slug}`}
              className="flex h-full flex-col rounded-2xl border border-brand-gray bg-white p-6 shadow-sm transition hover:border-brand-maroon/40"
            >
              <span className="font-display text-xl font-bold text-brand-blue">
                {a.name}
              </span>
              <span className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-maroon">
                View association →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
