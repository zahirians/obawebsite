import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function AdminProtected({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const { isAdmin, checking } = useIsAdmin(session);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate("/admin/login", { replace: true });
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray text-brand-blue">
        Loading…
      </div>
    );
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray text-brand-blue">
        Verifying access…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-gray px-4 text-center">
        <p className="font-display text-xl font-bold text-brand-blue">
          Access not authorised
        </p>
        <p className="mt-3 max-w-md text-sm text-brand-blue/80">
          {session.user.email} is not allow-listed.
        </p>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="mt-8 rounded-full bg-brand-maroon px-8 py-3 text-sm font-bold uppercase text-white"
        >
          Sign out
        </button>
        <Link to="/" className="mt-6 text-sm font-semibold text-brand-maroon">
          Home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
