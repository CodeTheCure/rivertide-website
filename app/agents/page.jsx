"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AgentsPage() {
  useEffect(() => {
    // Capability card animation
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".cap-card").forEach((el) => observer.observe(el));

    // Walkthrough step animation
    const walkthroughObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            walkthroughObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    document
      .querySelectorAll(".walkthrough-step")
      .forEach((el) => walkthroughObserver.observe(el));

    // Typing agent effect
    const timeout = setTimeout(() => {
      const typingEl = document.getElementById("typing-agent");
      if (typingEl) {
        typingEl.classList.remove("opacity-0");
        typingEl.classList.add("opacity-100");
        typingEl.style.transition = "opacity 0.6s ease";
      }
    }, 2000);

    // Cursor blink style (already in globals.css, but inject dynamically too)
    // Just a fallback ensure — already defined in globals.css

    return () => {
      observer.disconnect();
      walkthroughObserver.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main className="pt-20">
      {/* ---- Hero ---- */}
      <section className="relative min-h-[70vh] flex items-center pb-20 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-container-padding w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center pt-8 lg:pt-16">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-lavender/50 rounded-full border border-secondary/10 mb-8">
                <span className="font-label-caps text-[10px] text-healing-teal tracking-[0.1em]">
                  In BETA
                </span>
              </div>
              <h1 className="font-headline-lg text-[40px] sm:text-[56px] md:text-[80px] leading-[1.05] tracking-tight mb-6 text-primary">
                Agents that <br />
                <span className="italic font-light text-healing-teal">fight with you.</span>
              </h1>
              <p className="font-body-lg text-[20px] text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                Rivertide Agents are purpose-built AI assistants that understand your full oncology
                journey &mdash; medications, symptoms, appointments, and paperwork &mdash; so you
                don&apos;t have to carry it alone.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="tx-btn tx-btn--primary tx-btn--md">
                  <span className="tx-btn__inner">Get early access</span>
                </Link>
                <Link href="/#walkthrough" className="tx-btn tx-btn--secondary tx-btn--md">
                  <span className="tx-btn__inner">
                    <span className="material-symbols-outlined">play_arrow</span>
                    See how it works
                  </span>
                </Link>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-[400px] h-[400px] bg-healing-teal/5 rounded-full blur-[100px]"></div>
              <div className="relative bg-[#18151B] rounded-3xl p-6 border border-white/5 shadow-2xl w-full max-w-md">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="ml-2 text-[10px] text-white/30 font-['JetBrains_Mono',monospace] tracking-widest">
                    AGENT_RUNTIME
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-healing-teal/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-healing-teal text-lg">
                        medication
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Herceptin dosage confirmed</p>
                      <p className="text-white/50 text-xs mt-0.5">
                        Your last dose was 4.0 mg yesterday. Next: Thursday.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3 floating-badge">
                    <div className="w-9 h-9 rounded-lg bg-alert-crimson/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-alert-crimson text-lg">
                        symptoms
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Nausea reported &mdash; logged</p>
                      <p className="text-white/50 text-xs mt-0.5">
                        Pattern detected: peaks 6-8h post-infusion.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3 opacity-0" id="typing-agent">
                    <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary text-lg">
                        auto_awesome
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm">
                        <span className="text-white/40 text-xs">Checking portal for new results...</span>
                        <span className="correction-cursor"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Capabilities Grid ---- */}
      <section className="py-section-gap px-container-padding bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-4">
              What your <span className="italic font-light text-healing-teal">Agent</span> can do
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Each capability is purpose-built for your oncology journey &mdash; private, adaptive,
              and always learning your context.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="cap-grid">
            {[
              {
                icon: (
                  <img
                    src="https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png"
                    alt="Gmail"
                    className="w-7 h-7 object-contain"
                    style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(70%) saturate(500%) hue-rotate(150deg)" }}
                  />
                ),
                iconBg: "bg-healing-teal/10",
                title: "Gmail Integration",
                desc: "Read, draft, and organize emails &mdash; with your explicit permission. Never miss a provider message again.",
                delay: 0,
              },
              {
                icon: <span className="material-symbols-outlined text-secondary text-3xl">route</span>,
                iconBg: "bg-soft-lavender/60",
                title: "Full Journey Map",
                desc: "Your agent builds a live timeline of your diagnosis, treatments, scans, and appointments &mdash; so you always know where you are.",
                delay: 0.1,
              },
              {
                icon: <span className="material-symbols-outlined text-alert-crimson text-3xl">medication</span>,
                iconBg: "bg-alert-crimson/10",
                title: "Medication Tracking",
                desc: "Know every dose, schedule, and interaction. Your agent tracks your full regimen and alerts you to changes.",
                delay: 0.15,
              },
              {
                icon: <span className="material-symbols-outlined text-secondary text-3xl">monitor_heart</span>,
                iconBg: "bg-secondary-container/60",
                title: "Symptom Monitoring",
                desc: "Log symptoms by voice or text. Your agent detects patterns and correlations with your treatment cycle automatically.",
                delay: 0.2,
              },
              {
                icon: <span className="material-symbols-outlined text-healing-teal text-3xl">memory</span>,
                iconBg: "bg-primary/5 border border-primary/10",
                title: "Local LLM Option",
                desc: "Process everything on-device with a fully local LLM. Your data never leaves your control &mdash; <b>100% private by default</b>.",
                delay: 0.3,
              },
              {
                icon: <span className="material-symbols-outlined text-healing-teal text-3xl">cloud_sync</span>,
                iconBg: "bg-healing-teal/10",
                title: "Health Portal Sync",
                desc: "Connect to MyChart, Epic, HealthConnect, and more. Pull lab results, visit summaries, and upcoming appointments.",
                delay: 0.35,
              },
              {
                icon: <span className="material-symbols-outlined text-secondary text-3xl">forum</span>,
                iconBg: "bg-soft-lavender/60",
                title: "Request via Text",
                desc: "Need a refill, an appointment change, or a question for your doctor? Just say it &mdash; your agent drafts and sends it securely.",
                delay: 0.4,
              },
              {
                icon: <span className="material-symbols-outlined text-alert-crimson text-3xl">description</span>,
                iconBg: "bg-alert-crimson/10",
                title: "Form Review &amp; Fill",
                desc: "Upload any medical form. Your agent reviews it, highlights what matters, and helps you fill it &mdash; all in plain language.",
                delay: 0.45,
              },
            ].map((card, i) => (
              <div
                key={i}
                className="cap-card bg-white rounded-3xl p-8 border border-outline/5 shadow-sm"
                style={{ transitionDelay: `${card.delay}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6 cap-icon`}>
                  {card.icon}
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">{card.title}</h3>
                <p
                  className="font-body-md text-body-md text-on-surface-variant mb-4"
                  dangerouslySetInnerHTML={{ __html: card.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Three Simple Steps ---- */}
      <section className="py-section-gap px-container-padding bg-surface overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-4">
              Three simple steps. <span className="italic font-light text-healing-teal">No learning curve.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="walkthrough-step p-8 text-center" style={{ transitionDelay: "0s" }}>
              <div className="w-20 h-20 rounded-full bg-soft-lavender flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  mic
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-3">1. Speak naturally</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Just talk &mdash; messy, fragmented, whatever comes out. Your agent listens and
                understands context, not just keywords.
              </p>
            </div>
            <div className="walkthrough-step p-8 text-center" style={{ transitionDelay: "0.2s" }}>
              <div className="w-20 h-20 rounded-full bg-soft-lavender flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-3">2. Agent interprets</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your agent cross-references your words with your journey map, medication schedule,
                and health portal data to form a complete picture.
              </p>
            </div>
            <div className="walkthrough-step p-8 text-center" style={{ transitionDelay: "0.4s" }}>
              <div className="w-20 h-20 rounded-full bg-soft-lavender flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  checklist
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-3">3. Action taken</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Whether it&apos;s logging a symptom, drafting a message, or finding a form &mdash;
                your agent handles it and tells you what was done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Privacy Section ---- */}
      <section className="py-section-gap px-container-padding bg-primary relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-secondary-fixed text-4xl">lock</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-primary mb-6">
            Your data. <span className="italic font-light">Your rules.</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl mx-auto mb-12">
            Every capability runs with your explicit consent. Choose between cloud agents (with
            encrypted processing) or a <b>fully local LLM</b> that keeps everything on your device.
            You are always in control.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: "gpp_good", label: "HIPAA Compliant" },
              { icon: "encrypted", label: "End-to-End Encrypted" },
              { icon: "offline_bolt", label: "Local Processing" },
              { icon: "visibility_off", label: "No Data Selling" },
            ].map((item, i) => (
              <div key={i} className="bg-primary-container/40 p-6 rounded-2xl border border-on-primary/10">
                <span className="material-symbols-outlined text-secondary-fixed text-3xl mb-3">
                  {item.icon}
                </span>
                <h4 className="text-on-primary text-sm font-bold">{item.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="py-section-gap px-container-padding text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg mb-6">Ready to lighten the load?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="tx-btn tx-btn--primary tx-btn--lg">
              <span className="tx-btn__inner">Join the Waitlist</span>
            </Link>
            <Link href="/" className="tx-btn tx-btn--secondary tx-btn--lg">
              <span className="tx-btn__inner">Back to Home</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
