"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LS_KEY = "rivertide.transcripts.v1";
const SYNC_BASE = "http://127.0.0.1:8937";
const ACCOUNT_KEY = "rivertide_account";

function relTime(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso || "";
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  if (s < 604800) return Math.floor(s / 86400) + "d ago";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function merge(a, b) {
  const map = {};
  a.forEach((t) => t?.id && (map[t.id] = t));
  let added = 0;
  (b || []).forEach((t) => {
    if (t?.id && !map[t.id]) {
      map[t.id] = t;
      added++;
    }
  });
  const out = Object.values(map);
  out.sort((x, y) => String(y.created_at || "").localeCompare(String(x.created_at || "")));
  return { list: out, added };
}

const bars = [
  { wh: "45%", wd: ".38s", wdel: "-.1s" },
  { wh: "80%", wd: ".5s", wdel: "-.25s" },
  { wh: "55%", wd: ".44s", wdel: "-.4s" },
  { wh: "95%", wd: ".56s", wdel: "-.05s" },
  { wh: "65%", wd: ".4s", wdel: "-.3s" },
  { wh: "85%", wd: ".52s", wdel: "-.15s" },
  { wh: "50%", wd: ".46s", wdel: "-.35s" },
];

function Wave() {
  return (
    <span className="mini-wave" aria-hidden="true" style={{ height: 22, color: "#034F46" }}>
      {bars.map((b, i) => (
        <span key={i} style={{ "--wh": b.wh, "--wd": b.wd, "--wdel": b.wdel, width: 3 }} />
      ))}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("checking");
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("history");

  // Check authentication
  useEffect(() => {
    const accountStr = localStorage.getItem(ACCOUNT_KEY);
    if (!accountStr) {
      router.push("/login");
      return;
    }

    try {
      const account = JSON.parse(accountStr);
      if (!account.initialized) {
        router.push("/onboarding");
        return;
      }
      
      // Set greeting from account
      if (account.name) {
        setGreeting(`Welcome back, ${account.name.split(" ")[0]}.`);
      }
    } catch {
      router.push("/login");
      return;
    }
  }, [router]);

  // Load initial data
  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
    } catch {
      setList([]);
    }
  }, []);

  const pullSync = useCallback(async () => {
    setStatus("checking");
    let remote = [];
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 1800);
      const res = await fetch(`${SYNC_BASE}/transcripts`, { signal: ctl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      remote = Array.isArray(data) ? data : (data?.transcripts) || [];
    } catch {
      /* desktop app not running */
    }
    setList((prev) => {
      const { list: merged, added } = merge(prev, remote);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
      } catch {
        /* storage full */
      }
      setStatus(remote.length ? "connected" : "offline");
      return merged;
    });
  }, []);

  useEffect(() => {
    pullSync();
  }, [pullSync]);

  const filtered = useMemo(() => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter((t) => `${t.text || ""} ${t.raw || ""}`.toLowerCase().includes(q));
  }, [list, query]);

  const deleteEntry = (id) => {
    setList((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    try {
      fetch(`${SYNC_BASE}/transcripts/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
    } catch {
      /* ignore */
    }
  };

  const copyText = (text) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const handleLogout = () => {
    // Don't actually delete the account, just redirect to login
    // The account stays in localStorage
    router.push("/login");
  };

  const fmtDuration = (ms) => {
    if (!ms) return "";
    return (ms / 1000).toFixed(1) + "s";
  };

  return (
    <main className="pt-20 min-h-screen">
      {/* Dashboard Header */}
      <section className="w-full py-8 px-container-padding border-b border-outline/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {greeting && (
              <p className="font-label-caps text-[11px] tracking-[0.2em] text-on-surface-variant/70 mb-2">
                {greeting}
              </p>
            )}
            <h1 className="font-headline-lg text-headline-lg">
              Rivertide <span className="italic font-light text-healing-teal">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="tx-btn tx-btn--secondary tx-btn--sm"
            >
              <span className="tx-btn__inner">Log Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sync Status */}
      <section className="w-full px-container-padding py-4">
        <div className="max-w-4xl mx-auto">
          <span
            className={
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[12.5px] font-semibold " +
              (status === "connected"
                ? "bg-healing-teal/10 border-healing-teal/20 text-healing-teal"
                : status === "checking"
                ? "bg-soft-lavender/40 border-secondary/10 text-secondary"
                : "bg-alert-crimson/5 border-alert-crimson/15 text-alert-crimson")
            }
          >
            <span
              className={
                "w-2 h-2 rounded-full " +
                (status === "connected" ? "bg-healing-teal" : status === "checking" ? "bg-secondary" : "bg-alert-crimson")
              }
            />
            {status === "connected"
              ? "KeyCog connected"
              : status === "checking"
              ? "Checking KeyCog..."
              : "KeyCog offline — showing saved history"}
          </span>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="w-full px-container-padding pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-outline/10">
            <button
              className={`pb-3 px-2 font-label-caps text-[12px] tracking-wider ${activeTab === "history" ? "text-healing-teal border-b-2 border-healing-teal" : "text-on-surface-variant/70"}`}
              onClick={() => setActiveTab("history")}
            >
              Dictation History
            </button>
            <button
              className={`pb-3 px-2 font-label-caps text-[12px] tracking-wider ${activeTab === "settings" ? "text-healing-teal border-b-2 border-healing-teal" : "text-on-surface-variant/70"}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {/* History Tab */}
          {activeTab === "history" && (
            <>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <input
                    className="w-full bg-surface-container-low border-2 border-outline-variant focus:border-healing-teal focus:ring-0 rounded-2xl py-3.5 px-4 font-body-md transition-all text-[15px]"
                    placeholder="Search your dictations..."
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <span className="font-label-caps text-[12px] tracking-wider text-on-surface-variant/70">
                  {filtered.length} dictation{filtered.length === 1 ? "" : "s"}
                </span>
                <button className="tx-btn tx-btn--secondary tx-btn--sm" type="button" onClick={pullSync}>
                  <span className="tx-btn__inner">Sync</span>
                </button>
              </div>

              {/* History List */}
              <div className="space-y-5">
                {filtered.map((t) => (
                  <article
                    key={t.id}
                    className="speech-item glass-panel rounded-3xl border border-outline/10 shadow-sm p-6 md:p-7"
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Wave />
                        <span className="text-[13px] text-on-surface-variant">{relTime(t.created_at)}</span>
                        {t.duration_ms && (
                          <span className="text-[11px] text-on-surface-variant/70 font-label-caps tracking-wider">
                            {fmtDuration(t.duration_ms)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          className="text-[12px] font-bold text-healing-teal hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-healing-teal/5"
                          onClick={() => copyText(t.text)}
                        >
                          Copy
                        </button>
                        <button
                          className="text-[12px] font-bold text-on-surface-variant/50 hover:text-alert-crimson transition-colors px-3 py-1.5 rounded-full hover:bg-alert-crimson/5"
                          onClick={() => deleteEntry(t.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="font-transcript-text text-transcript-text text-healing-teal font-semibold speech-item cleaned leading-relaxed">
                      {t.text}
                    </p>
                    {t.raw && t.raw !== t.text && (
                      <div className="mt-3 pt-3 border-t border-outline/5">
                        <p className="text-[13px] italic text-on-surface-variant/60 leading-relaxed speech-item chaotic">
                          "{t.raw}"
                        </p>
                      </div>
                    )}
                  </article>
                ))}

                {filtered.length === 0 && (
                  <div className="glass-panel rounded-3xl border border-outline/10 shadow-sm py-16 px-8 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-lg border border-outline/5 flex items-center justify-center mx-auto mb-6 text-healing-teal">
                      <Wave />
                    </div>
                    <h2 className="font-headline-md text-headline-md mb-3">Nothing here yet</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                      Install the Rivertide desktop app (KeyCog), then hold fn and talk. Your dictations appear
                      here automatically — nothing leaves this computer.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="glass-panel rounded-3xl border border-outline/10 shadow-sm p-8">
              <h2 className="font-headline-md text-headline-md mb-6">Settings</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Rivertide settings will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
