import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Batch = {
  logo_url: string | null;
  official_title: string | null;
  custom_title: string | null;
  ol_year: number | null;
  al_year: number | null;
  description: string | null;
  exco_photo_url: string | null;
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
};

export function BatchDetailPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    void supabase
      .from("batches")
      .select(
        "id,logo_url,official_title,custom_title,ol_year,al_year,description,exco_photo_url"
      )
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setFound(false);
          setBatch(null);
          setProjects([]);
          setLoading(false);
          return;
        }
        setFound(true);
        const { id, ...rest } = data as { id: string } & Batch;
        setBatch(rest);
        void supabase
          .from("projects")
          .select("id,title,description,image_url,link_url")
          .eq("batch_id", id)
          .order("sort_order")
          .then(({ data: p }) => {
            setProjects((p as Project[]) ?? []);
            setLoading(false);
          });
      });
  }, [slug]);

  if (!slug) return null;

  if (!loading && !found) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-brand-blue/70">
        Batch not found.
        <div className="mt-6">
          <Link to="/alumni/batches" className="text-brand-maroon font-semibold">
            ← All batches
          </Link>
        </div>
      </div>
    );
  }

  const title = batch?.custom_title || batch?.official_title || "Batch";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <Link
        to="/alumni/batches"
        className="text-sm font-semibold text-brand-maroon hover:underline"
      >
        ← Batches
      </Link>
      {loading ? (
        <p className="mt-8 text-brand-blue/60">Loading…</p>
      ) : batch ? (
        <>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
            {batch.logo_url && (
              <img
                src={batch.logo_url}
                alt=""
                className="h-28 w-28 rounded-xl border border-brand-gray bg-white object-contain p-2"
              />
            )}
            <div>
              <h1 className="font-display text-4xl font-bold text-brand-blue">
                {title}
              </h1>
              {batch.official_title && batch.custom_title && (
                <p className="mt-2 text-brand-blue/80">{batch.official_title}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-brand-blue/70">
                {batch.ol_year != null && <span>O/L {batch.ol_year}</span>}
                {batch.al_year != null && <span>A/L {batch.al_year}</span>}
              </div>
            </div>
          </div>
          {batch.exco_photo_url && (
            <img
              src={batch.exco_photo_url}
              alt=""
              className="mt-8 w-full max-h-[420px] rounded-2xl object-cover"
            />
          )}
          {batch.description && (
            <p className="mt-8 whitespace-pre-line text-brand-blue/90 leading-relaxed">
              {batch.description}
            </p>
          )}
        </>
      ) : null}

      {!loading && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-brand-blue">
            Projects
          </h2>
          {projects.length === 0 ? (
            <p className="mt-4 text-sm text-brand-blue/60">No projects listed.</p>
          ) : (
            <ul className="mt-6 space-y-6">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="rounded-2xl border border-brand-gray bg-brand-gray/30 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt=""
                        className="h-40 w-full rounded-lg object-cover md:w-48"
                      />
                    )}
                    <div>
                      <h3 className="font-display text-xl font-bold text-brand-blue">
                        {p.title}
                      </h3>
                      {p.description && (
                        <p className="mt-2 text-sm text-brand-blue/85 whitespace-pre-line">
                          {p.description}
                        </p>
                      )}
                      {p.link_url && (
                        <a
                          href={p.link_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block text-sm font-bold text-brand-maroon hover:underline"
                        >
                          Open link →
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
