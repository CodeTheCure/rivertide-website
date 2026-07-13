"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://buqkyurrybxcdrdleoht.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_feAgAlQ5gBQ2q6CfopHMtg_IQa5KOzu";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !role) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    let directSuccess = false;

    // Try direct Supabase insert (RLS anon policy allows inserts)
    try {
      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error: insertError } = await supabaseClient
        .from("waitlist")
        .insert({ name: name.trim(), email: email.trim(), role, source: "website" });

      if (!insertError) {
        directSuccess = true;
      } else if (insertError.code === "23505") {
        setLoading(false);
        setError("This email is already on the waitlist.");
        return;
      } else {
        console.warn("Supabase direct insert failed:", insertError);
      }
    } catch (supabaseErr) {
      console.warn("Supabase client error:", supabaseErr);
    }

    if (directSuccess) {
      setLoading(false);
      setSuccess(true);
      return;
    }

    // Fall back to the API server (Next.js API route)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.errors?.[0] || "Something went wrong.");
      }

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      // Both Supabase and API failed — save to localStorage as last resort
      try {
        const existing = JSON.parse(
          localStorage.getItem("rivertide_waitlist") || "[]"
        );
        existing.push({
          name: name.trim(),
          email: email.trim(),
          role,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem("rivertide_waitlist", JSON.stringify(existing));
      } catch (_) {
        /* localStorage full or blocked */
      }

      setLoading(false);
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <main className="pt-20 min-h-screen flex items-center">
        <section className="w-full py-section-gap px-container-padding hero-gradient min-h-[calc(100vh-5rem)] flex items-center">
          <div className="max-w-2xl mx-auto w-full">
            <div className="glass-panel rounded-3xl border border-outline/10 shadow-2xl p-10 max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-healing-teal/10 flex items-center justify-center mx-auto mb-6 check-animate">
                <span
                  className="material-symbols-outlined text-healing-teal text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md mb-3 text-healing-teal">
                You&apos;re on the list!
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                We&apos;ll keep you posted on our progress and invite you as soon as we launch. No
                spam, ever.
              </p>
              <Link href="/" className="tx-btn tx-btn--primary tx-btn--md">
                <span className="tx-btn__inner">Back to Home</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen flex items-center">
      <section className="w-full py-section-gap px-container-padding hero-gradient min-h-[calc(100vh-5rem)] flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="font-headline-lg text-headline-lg mb-4">
              Join the <span className="italic font-light text-healing-teal">Waitlist</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
              Rivertide is currently in private beta. Get early access and be among the first to
              experience the Wellness OS for Oncology.
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-outline/10 shadow-2xl p-10 max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label
                  className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.15em]"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  className="waitlist-input w-full bg-surface p-4 rounded-2xl border-2 border-outline-variant focus:border-healing-teal focus:ring-0 font-body-md transition-all text-[15px]"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-4">
                <label
                  className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.15em]"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="waitlist-input w-full bg-surface p-4 rounded-2xl border-2 border-outline-variant focus:border-healing-teal focus:ring-0 font-body-md transition-all text-[15px]"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-4">
                <label
                  className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.15em]"
                  htmlFor="role"
                >
                  I am a...
                </label>
                <select
                  className="waitlist-input w-full bg-surface p-4 rounded-2xl border-2 border-outline-variant focus:border-healing-teal focus:ring-0 font-body-md transition-all text-[15px] text-on-surface-variant"
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="patient">Patient or Caregiver</option>
                  <option value="provider">Healthcare Provider</option>
                  <option value="researcher">Researcher</option>
                  <option value="partner">Potential Partner</option>
                  <option value="other">Just curious</option>
                </select>
              </div>

              {error && (
                <p className="text-alert-crimson text-sm font-body-md">{error}</p>
              )}

              <button
                className="tx-btn tx-btn--primary tx-btn--lg tx-btn--block mt-4"
                type="submit"
                disabled={loading}
              >
                <span className="tx-btn__inner">
                  {loading ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                      Submitting...
                    </>
                  ) : (
                    "Join the Waitlist"
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
