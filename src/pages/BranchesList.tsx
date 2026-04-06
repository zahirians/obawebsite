import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Branch = {
  id: string;
  slug: string;
  name: string;
  since_year: number | null;
};

export function BranchesListPage() {
  const [rows, setRows] = useState<Branch[]>([]);

  useEffect(() => {
    void supabase
      .from("branches")
      .select("id,slug,name,since_year")
      .order("name")
      .then(({ data }) => setRows((data as Branch[]) ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-maroon">
        Alumni · Branches
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-brand-blue">
        Branches
      </h1>
      <p className="mt-4 max-w-2xl text-brand-blue/85">
        Dedicated pages for each regional branch of the Old Boys’ Association.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((b) => (
          <li key={b.id}>
            <Link
              to={`/alumni/branches/${b.slug}`}
              className="flex h-full flex-col rounded-2xl border border-brand-gray bg-white p-6 shadow-sm transition hover:border-brand-maroon/40"
            >
              <span className="font-display text-xl font-bold text-brand-blue">
                {b.name}
              </span>
              {b.since_year != null && (
                <span className="mt-2 text-sm text-brand-blue/70">
                  Since {b.since_year}
                </span>
              )}
              <span className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-maroon">
                View branch →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
