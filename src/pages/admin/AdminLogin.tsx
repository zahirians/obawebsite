import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const { isAdmin, checking } = useIsAdmin(session);

  useEffect(() => {
    if (!loading && !checking && session && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [loading, checking, session, isAdmin, navigate]);

  async function signInGoogle() {
    const redirectTo = `${window.location.origin}/admin`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) console.error(error);
  }

  if (loading || (session && checking)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-blue text-brand-gray">
        Loading…
      </div>
    );
  }

  if (session && !checking && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-blue px-4 text-center text-brand-gray">
        <p className="font-display text-2xl font-bold">Access not authorised</p>
        <p className="mt-4 max-w-md text-sm text-brand-gray/90">
          {session.user.email} is not on the administrator allow-list. Ask a
          project owner to add your email to <code className="text-white">admin_emails</code>{" "}
          in Supabase.
        </p>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="mt-8 rounded-full bg-brand-maroon px-8 py-3 text-sm font-bold uppercase tracking-wide text-white"
        >
          Sign out
        </button>
        <Link to="/" className="mt-6 text-sm underline">
          Back to site
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-blue px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-maroon">
          Administration
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-brand-blue">
          OBA Zahira Mawanella
        </h1>
        <p className="mt-3 text-sm text-brand-blue/80">
          Sign in with Google. Only allow-listed emails can access the dashboard.
        </p>
        <button
          type="button"
          onClick={() => void signInGoogle()}
          className="mt-8 w-full rounded-full bg-brand-blue py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-maroon"
        >
          Continue with Google
        </button>
        <Link
          to="/"
          className="mt-6 block text-center text-sm font-semibold text-brand-maroon hover:underline"
        >
          ← Return to website
        </Link>
      </div>
    </div>
  );
}
