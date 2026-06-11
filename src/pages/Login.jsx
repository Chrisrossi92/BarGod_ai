import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/common/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const next = searchParams.get("next") || "/battlers";

  // Handle magic-link / OAuth redirect (?code=...)
  useEffect(() => {
    (async () => {
      const url = window.location.href;
      if (/\bcode=/.test(url)) {
        try {
          // supabase-js changed the signature across versions; try both
          if (typeof supabase.auth.exchangeCodeForSession === "function") {
            try {
              await supabase.auth.exchangeCodeForSession(url);
            } catch {
              await supabase.auth.exchangeCodeForSession({ currentUrl: url });
            }
          }
          navigate(next, { replace: true });
        } catch (e) {
          setErr(e.message || "Sign-in verification failed");
        }
      }
    })();
  }, [next, navigate]);

  async function sendMagicLink(e) {
    e.preventDefault();
    setErr("");
    try {
      const emailRedirectTo = `${window.location.origin}/login?next=${encodeURIComponent(
        next
      )}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo },
      });
      if (error) throw error;
      setSent(true);
    } catch (e) {
      setErr(e.message || "Failed to send link");
    }
  }

  async function signInWith(provider) {
    setErr("");
    const redirectTo = `${window.location.origin}/login?next=${encodeURIComponent(
      next
    )}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) setErr(error.message);
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <h1 className="text-xl font-extrabold">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Use a magic link or continue with a provider.
        </p>

        {err && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={sendMagicLink} className="mt-4 space-y-3">
          <div>
            <label className="text-xs opacity-80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            {sent ? "Link sent — check your email" : "Send magic link"}
          </Button>
        </form>

        <div className="my-4 h-px bg-zinc-800" />

        <div className="space-y-2">
          <Button onClick={() => signInWith("google")} className="w-full">
            Continue with Google
          </Button>
          {/* Add more providers if enabled: github, apple, etc. */}
        </div>

        <div className="mt-4 text-center text-xs text-zinc-400">
          <Link to={next} className="underline">
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}
