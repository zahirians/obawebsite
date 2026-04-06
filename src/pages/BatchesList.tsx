import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Batch = {
  id: string;
  slug: string;
  official_title: string | null;
  custom_title: string | null;
  al_year: number | null;
};

export function BatchesListPage() {
  const [rows, setRows] = useState<Batch[]>([]);

  useEffect(() => {
    void supabase
      .from("batches")
      .select("id,slug,official_title,custom_title,al_year")
      .order("al_year", { ascending: false, nullsFirst: false })
      .then(({ data }) => setRows((data as Batch[]) ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-maroon">
        Alumni · Batches
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-brand-blue">
        Batches
      </h1>
      <p className="mt-4 max-w-2xl text-brand-blue/85">
        Each registered batch has its own page with logos, years, descriptions,
        and executive committee photos.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.length === 0 && (
          <li className="text-sm text-brand-blue/60 col-span-full">
            No batches yet — add them in the admin console.
          </li>
        )}
        {rows.map((b) => (
          <li key={b.id}>
            <Link
              to={`/alumni/batches/${b.slug}`}
              className="flex h-full flex-col rounded-2xl border border-brand-gray bg-white p-6 shadow-sm transition hover:border-brand-maroon/40"
            >
              <span className="font-display text-lg font-bold text-brand-blue">
                {b.custom_title || b.official_title || "Batch"}
              </span>
              {b.official_title && b.custom_title && (
                <span className="mt-1 text-sm text-brand-blue/70">
                  {b.official_title}
                </span>
              )}
              {b.al_year != null && (
                <span className="mt-2 text-xs text-brand-blue/60">
                  A/L {b.al_year}
                </span>
              )}
              <span className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-maroon">
                View batch →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
