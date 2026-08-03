"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ACCOUNT_KEY = "rivertide_account";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const account = localStorage.getItem(ACCOUNT_KEY);
    if (account) {
      try {
        const acc = JSON.parse(account);
        if (acc.initialized) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } catch {
        router.push("/login");
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const storedAccount = localStorage.getItem(ACCOUNT_KEY);
    
    if (storedAccount) {
      // Account exists, check password
      try {
        const account = JSON.parse(storedAccount);
        if (account.password === password) {
          // Password correct, check if initialized
          if (account.initialized) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        } else {
          setError("Incorrect password. Please try again.");
        }
      } catch {
        setError("Failed to read account data.");
      }
    } else {
      // No account exists - this is first login, create account
      if (name.trim() && password.length >= 4) {
        const newAccount = {
          name: name.trim(),
          createdAt: new Date().toISOString(),
          password: password,
          initialized: false,
        };
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(newAccount));
        router.push("/onboarding");
      } else if (!name.trim()) {
        setError("Please enter your name.");
      } else {
        setError("Password must be at least 4 characters.");
      }
    }

    setLoading(false);
  };

  return (
    <main className="pt-20 min-h-screen flex items-center">
      <section className="w-full py-section-gap px-container-padding hero-gradient min-h-[calc(100vh-5rem)] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="font-headline-lg text-headline-lg mb-4">
              Welcome to <span className="italic font-light text-healing-teal">Rivertide</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Please enter your password to access your dictation history.
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-outline/10 shadow-2xl p-10 max-w-md mx-auto">
            {isCreatingAccount ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label
                    className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.15em]"
                    htmlFor="name"
                  >
                    Your Name
                  </label>
                  <input
                    className="waitlist-input w-full bg-surface p-4 rounded-2xl border-2 border-outline-variant focus:border-healing-teal focus:ring-0 font-body-md transition-all text-[15px]"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.15em]"
                    htmlFor="password"
                  >
                    Create Password
                  </label>
                  <input
                    className="waitlist-input w-full bg-surface p-4 rounded-2xl border-2 border-outline-variant focus:border-healing-teal focus:ring-0 font-body-md transition-all text-[15px]"
                    id="password"
                    name="password"
                    placeholder="Create a password (min 4 characters)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="text-alert-crimson text-sm font-body-md text-center">{error}</p>
                )}

                <button
                  className="tx-btn tx-btn--primary tx-btn--lg tx-btn--block"
                  type="submit"
                  disabled={loading}
                >
                  <span className="tx-btn__inner">
                    {loading ? "Creating Account..." : "Create Account"}
                  </span>
                </button>

                <p className="text-center text-[13px] text-on-surface-variant/70">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsCreatingAccount(false)}
                    className="text-healing-teal hover:underline"
                  >
                    Log in instead
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label
                    className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.15em]"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="waitlist-input w-full bg-surface p-4 rounded-2xl border-2 border-outline-variant focus:border-healing-teal focus:ring-0 font-body-md transition-all text-[15px]"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="text-alert-crimson text-sm font-body-md text-center">{error}</p>
                )}

                <button
                  className="tx-btn tx-btn--primary tx-btn--lg tx-btn--block"
                  type="submit"
                  disabled={loading}
                >
                  <span className="tx-btn__inner">
                    {loading ? "Logging in..." : "Log In"}
                  </span>
                </button>

                <p className="text-center text-[13px] text-on-surface-variant/70">
                  First time?{" "}
                  <button
                    type="button"
                    onClick={() => setIsCreatingAccount(true)}
                    className="text-healing-teal hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
