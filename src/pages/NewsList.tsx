import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published_at: string | null;
};

export function NewsListPage() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    void supabase
      .from("news")
      .select("id,title,description,image_url,published_at")
      .order("published_at", { ascending: false })
      .then(({ data }) => setItems((data as NewsItem[]) ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-maroon">
        News
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-brand-blue">
        News & announcements
      </h1>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {items.length === 0 && (
          <p className="text-sm text-brand-blue/60 md:col-span-2">
            No news published yet.
          </p>
        )}
        {items.map((n) => (
          <article
            key={n.id}
            className="overflow-hidden rounded-2xl border border-brand-gray bg-white shadow-sm"
          >
            <div className="aspect-[16/9] bg-brand-gray">
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
            <div className="p-6">
              {n.published_at && (
                <time
                  dateTime={n.published_at}
                  className="text-xs font-semibold uppercase tracking-wide text-brand-maroon"
                >
                  {new Date(n.published_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              <h2 className="mt-2 font-display text-2xl font-bold text-brand-blue">
                {n.title}
              </h2>
              {n.description && (
                <p className="mt-3 text-brand-blue/85 whitespace-pre-line">
                  {n.description}
                </p>
              )}
              <Link
                to="/contact"
                className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-brand-maroon hover:underline"
              >
                Enquire →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
