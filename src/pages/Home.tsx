import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Highlight = {
  image_url: string | null;
  title: string | null;
  description: string | null;
  button_label: string | null;
  button_href: string | null;
};

type NewsItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published_at: string | null;
};

export function HomePage() {
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    void supabase
      .from("home_highlight")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setHighlight(data as Highlight | null));

    void supabase
      .from("news")
      .select("id,title,description,image_url,published_at")
      .order("published_at", { ascending: false })
      .limit(4)
      .then(({ data }) => setNews((data as NewsItem[]) ?? []));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-blue text-brand-gray">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#820000_0%,transparent_50%),radial-gradient(circle_at_80%_60%,#ebebeb_0%,transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-gray/90">
            Who we are
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl">
            A fellowship of Zahirians, united across generations and borders.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray/95">
            The Old Boys’ Association of Zahira College Mawanella brings together
            alumni who share a bond to our school and to one another. We support
            current students, strengthen networks between batches and branches,
            and preserve the spirit of our alma mater through service,
            camaraderie, and lifelong friendship.
          </p>
        </div>
      </section>

      <section className="border-b border-brand-gray bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div
            className={`relative min-h-[220px] overflow-hidden rounded-2xl bg-brand-gray ${
              highlight?.image_url ? "" : "ring-2 ring-brand-maroon/20"
            }`}
          >
            {highlight?.image_url ? (
              <img
                src={highlight.image_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center p-8 text-center text-brand-blue/60">
                Highlight image — managed in Admin
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-maroon">
              Membership spotlight
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-blue md:text-4xl">
              {highlight?.title ?? "Alumni Membership"}
            </h2>
            <p className="mt-4 text-brand-blue/85">
              {highlight?.description ??
                "Join as a member to support the association, access member benefits, and receive your discount card."}
            </p>
            <Link
              to={highlight?.button_href ?? "/alumni/membership"}
              className="mt-8 inline-flex items-center rounded-full bg-brand-maroon px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-brand-blue"
            >
              {highlight?.button_label ?? "Become a Member"}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-gray/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-maroon">
                News
              </p>
              <h2 className="font-display text-3xl font-bold text-brand-blue">
                Latest updates
              </h2>
            </div>
            <Link
              to="/news"
              className="hidden text-sm font-semibold text-brand-maroon hover:underline sm:inline"
            >
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {news.length === 0 && (
              <p className="text-sm text-brand-blue/70 col-span-full">
                No news yet — add items from the admin console.
              </p>
            )}
            {news.map((n) => (
              <article
                key={n.id}
                className="flex flex-col overflow-hidden rounded-xl border border-brand-gray bg-white shadow-sm"
              >
                <div className="aspect-[4/3] bg-brand-gray">
                  {n.image_url ? (
                    <img
                      src={n.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-brand-blue/50">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display text-lg font-bold text-brand-blue line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-brand-blue/80 line-clamp-3">
                    {n.description}
                  </p>
                  <Link
                    to="/news"
                    className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-maroon hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <Link
            to="/news"
            className="mt-8 inline-block text-sm font-semibold text-brand-maroon hover:underline sm:hidden"
          >
            View all news →
          </Link>
        </div>
      </section>

      <section className="bg-brand-blue py-16 text-brand-gray">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Join our Alumni Membership
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-gray/95">
            Get your official discount card, stay connected with batches and
            branches, and help us give back to Zahira College Mawanella.
          </p>
          <Link
            to="/alumni/membership"
            className="mt-10 inline-flex rounded-full bg-brand-maroon px-10 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-xl transition hover:bg-brand-gray hover:text-brand-blue"
          >
            Get your discount card
          </Link>
        </div>
      </section>
    </div>
  );
}
