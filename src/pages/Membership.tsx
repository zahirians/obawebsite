import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function MembershipPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [benefitsMd, setBenefitsMd] = useState<string | null>(null);

  useEffect(() => {
    void supabase
      .from("membership_content")
      .select("summary,benefits_md")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        setSummary(data?.summary ?? null);
        setBenefitsMd(data?.benefits_md ?? null);
      });
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-maroon">
        Alumni
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-brand-blue">
        Membership
      </h1>
      <div className="mt-8 space-y-6 text-brand-blue/90 leading-relaxed">
        {summary ? (
          <p className="whitespace-pre-line">{summary}</p>
        ) : (
          <p className="text-brand-blue/60">
            Membership summary will appear here once added in the admin console.
          </p>
        )}
        {benefitsMd ? (
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-blue">
              Benefits
            </h2>
            <div className="mt-4 whitespace-pre-line">{benefitsMd}</div>
          </div>
        ) : null}
      </div>
      <div className="mt-12 rounded-2xl bg-brand-gray/60 p-8 text-center">
        <p className="font-semibold text-brand-blue">Ready to join?</p>
        <p className="mt-2 text-sm text-brand-blue/80">
          Contact the association or complete the enrollment process as
          communicated by your branch or batch.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-flex rounded-full bg-brand-maroon px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-blue"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
