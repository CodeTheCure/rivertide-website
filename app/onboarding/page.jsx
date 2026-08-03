"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ACCOUNT_KEY = "rivertide_account";
const SYNC_BASE = "http://127.0.0.1:8937";

export default function OnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");

  // Check if already logged in and initialized
  useEffect(() => {
    const accountStr = localStorage.getItem(ACCOUNT_KEY);
    if (!accountStr) {
      router.push("/login");
      return;
    }

    try {
      const account = JSON.parse(accountStr);
      if (account.initialized) {
        router.push("/dashboard");
        return;
      }
    } catch {
      router.push("/login");
      return;
    }

    // Start the initialization process
    initializeAccount();
  }, [router]);

  const initializeAccount = async () => {
    setStatus("checking");
    setError("");

    try {
      // Check if KeyCog desktop app is running
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${SYNC_BASE}/transcripts`, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        // KeyCog is running, initialize localStorage
        setStatus("initializing");
        
        // Create empty transcripts array if it doesn't exist
        if (!localStorage.getItem("rivertide.transcripts.v1")) {
          localStorage.setItem("rivertide.transcripts.v1", JSON.stringify([]));
        }

        // Mark account as initialized
        const accountStr = localStorage.getItem(ACCOUNT_KEY);
        if (accountStr) {
          const account = JSON.parse(accountStr);
          account.initialized = true;
          account.initializedAt = new Date().toISOString();
          localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
        }

        setStatus("success");
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setStatus("not-running");
        setError("KeyCog desktop app is not running. Please start KeyCog and refresh this page.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setStatus("not-running");
        setError("KeyCog desktop app is not running. Please start KeyCog and refresh this page.");
      } else {
        setStatus("error");
        setError("Failed to connect to KeyCog. Please ensure it's running and try again.");
      }
    }
  };

  const renderStatus = () => {
    switch (status) {
      case "checking":
        return (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-healing-teal/10 border-4 border-healing-teal border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Checking for KeyCog desktop app...
            </p>
          </div>
        );

      case "initializing":
        return (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-healing-teal/10 border-4 border-healing-teal border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Initializing your dictation history...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-healing-teal/10 flex items-center justify-center mx-auto mb-6 check-animate">
              <span
                className="material-symbols-outlined text-healing-teal text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md mb-3 text-healing-teal">
              Setup Complete!
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your dictation history is ready. Redirecting to dashboard...
            </p>
          </div>
        );

      case "not-running":
      case "error":
        return (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-alert-crimson/10 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-alert-crimson text-4xl">
                error
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md mb-3 text-alert-crimson">
              Connection Failed
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {error}
            </p>
            <button
              className="tx-btn tx-btn--primary tx-btn--md"
              onClick={initializeAccount}
            >
              <span className="tx-btn__inner">Retry</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="pt-20 min-h-screen flex items-center">
      <section className="w-full py-section-gap px-container-padding hero-gradient min-h-[calc(100vh-5rem)] flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="font-headline-lg text-headline-lg mb-4">
              Setting up <span className="italic font-light text-healing-teal">Rivertide</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              We need to connect to the KeyCog desktop app to initialize your dictation history.
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-outline/10 shadow-2xl p-10 max-w-lg mx-auto">
            {renderStatus()}
          </div>
        </div>
      </section>
    </main>
  );
}
