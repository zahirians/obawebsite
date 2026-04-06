import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Branch = {
  name: string;
  since_year: number | null;
  description: string | null;
  members_photo_url: string | null;
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
};

export function BranchDetailPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    void supabase
      .from("branches")
      .select("id,name,since_year,description,members_photo_url")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setFound(false);
          setBranch(null);
          setProjects([]);
          setLoading(false);
          return;
        }
        setFound(true);
        const { id, ...rest } = data as { id: string } & Branch;
        setBranch(rest);
        void supabase
          .from("projects")
          .select("id,title,description,image_url,link_url")
          .eq("branch_id", id)
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
        Branch not found.
        <div className="mt-6">
          <Link to="/alumni/branches" className="text-brand-maroon font-semibold">
            ← All branches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <Link
        to="/alumni/branches"
        className="text-sm font-semibold text-brand-maroon hover:underline"
      >
        ← Branches
      </Link>
      {loading ? (
        <p className="mt-8 text-brand-blue/60">Loading…</p>
      ) : branch ? (
        <>
          <h1 className="mt-6 font-display text-4xl font-bold text-brand-blue">
            {branch.name}
          </h1>
          {branch.since_year != null && (
            <p className="mt-2 text-sm text-brand-blue/70">
              Since {branch.since_year}
            </p>
          )}
          {branch.members_photo_url && (
            <img
              src={branch.members_photo_url}
              alt=""
              className="mt-8 w-full max-h-[420px] rounded-2xl object-cover"
            />
          )}
          {branch.description && (
            <p className="mt-8 whitespace-pre-line text-brand-blue/90 leading-relaxed">
              {branch.description}
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
