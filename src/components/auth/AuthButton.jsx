import React from "react";
import { Link } from "react-router-dom";
import useAuthSession from "@/lib/useAuthSession";
import supabase from "@/lib/supabaseClient";

export default function AuthButton() {
  const { user } = useAuthSession();

  if (!user) {
    return (
      <Link
        to="/login"
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-800"
      >
        Sign in
      </Link>
    );
  }

  const label = user.email?.[0]?.toUpperCase() ?? "U";

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-lime-500 text-black text-sm font-bold">
        {label}
      </span>
      <button
        onClick={signOut}
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-800"
      >
        Sign out
      </button>
    </div>
  );
}
