import { Link } from "react-router-dom";

const cards = [
  {
    to: "/alumni/membership",
    title: "Membership",
    text: "Summary of membership, benefits, and how to enroll.",
  },
  {
    to: "/alumni/branches",
    title: "Branches",
    text: "UAE, Qatar, Kuwait, Riyadh, Colombo — each with its own space.",
  },
  {
    to: "/alumni/batches",
    title: "Batches",
    text: "Official batch pages with exco photos, years, and projects.",
  },
  {
    to: "/alumni/associations",
    title: "Associations",
    text: "Association pages with leadership photos and initiatives.",
  },
];

export function AlumniHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-maroon">
        Alumni
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-brand-blue">
        Alumni centre
      </h1>
      <p className="mt-4 max-w-2xl text-brand-blue/85">
        Explore membership, regional branches, your batch, and active
        associations. Content is maintained by authorised administrators.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-2xl border border-brand-gray bg-white p-8 shadow-sm transition hover:border-brand-maroon/40 hover:shadow-md"
          >
            <h2 className="font-display text-2xl font-bold text-brand-blue group-hover:text-brand-maroon">
              {c.title}
            </h2>
            <p className="mt-3 text-sm text-brand-blue/80">{c.text}</p>
            <span className="mt-6 inline-block text-xs font-bold uppercase tracking-wide text-brand-maroon">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
