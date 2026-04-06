import { Link, NavLink } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm font-semibold tracking-wide uppercase transition-colors",
    isActive ? "text-brand-maroon" : "text-brand-blue hover:text-brand-maroon",
  ].join(" ");

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-gray/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="group">
          <p className="font-display text-lg font-bold leading-tight text-brand-blue group-hover:text-brand-maroon md:text-xl">
            Old Boys’ Association
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-maroon md:text-sm">
            Zahira College Mawanella
          </p>
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/alumni" className={navClass}>
            Alumni
          </NavLink>
          <NavLink to="/news" className={navClass}>
            News
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
