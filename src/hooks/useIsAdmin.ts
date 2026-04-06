import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useIsAdmin(session: Session | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(!!session);

  useEffect(() => {
    if (!session?.user?.email) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    let cancelled = false;
    setChecking(true);
    void supabase
      .from("admin_emails")
      .select("email")
      .eq("email", session.user.email.toLowerCase())
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error(error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
        setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user?.email]);

  return { isAdmin, checking };
}
