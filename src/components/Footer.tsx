import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-gray bg-brand-gray/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between md:items-start">
        <div>
          <p className="font-display text-lg font-bold text-brand-blue">
            Old Boys’ Association
          </p>
          <p className="text-sm font-semibold text-brand-maroon">
            Zahira College Mawanella
          </p>
          <p className="mt-3 max-w-md text-sm text-brand-blue/80">
            Serving our alma mater and fellow old boys across branches, batches,
            and associations worldwide.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-brand-blue">Quick links</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/alumni/membership"
                className="text-brand-blue/80 hover:text-brand-maroon"
              >
                Membership
              </Link>
            </li>
            <li>
              <Link
                to="/news"
                className="text-brand-blue/80 hover:text-brand-maroon"
              >
                News
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-brand-blue/80 hover:text-brand-maroon"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="text-brand-blue/40 hover:text-brand-maroon"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-gray/80 bg-brand-blue py-3 text-center text-xs text-brand-gray">
        © {new Date().getFullYear()} Old Boys’ Association, Zahira College
        Mawanella
      </div>
    </footer>
  );
}
