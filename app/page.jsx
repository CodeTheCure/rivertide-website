"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function HomePage() {
  const [cognitiveLoad, setCognitiveLoad] = useState(20);
  const cognitiveHintRef = useRef(null);
  const complexDetailsRef = useRef(null);
  const agentIntroRef = useRef(null);
  const sectionObserverRef = useRef(null);
  const memoryFolderRef = useRef(null);
  const vaultWrapRef = useRef(null);
  const voiceWaveRef = useRef(null);
  const flowSvgRef = useRef(null);
  const sliderZones = [
    { max: 40, color: "#034f46", glow: "rgba(3,79,70,0.12)", hint: "The dashboard adapts to how you think." },
    { max: 70, color: "#6a5778", glow: "rgba(106,87,120,0.14)", hint: "Trimming the details for you..." },
    { max: 101, color: "#7F1C34", glow: "rgba(127,28,52,0.14)", hint: "Foggy mode: one simple task at a time." },
  ];

  // ---- Cognitive Slider Logic ----
  const currentZone = sliderZones.find((z) => cognitiveLoad < z.max) || sliderZones[0];

  // ---- Intersection Observer for sections ----
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    document.querySelectorAll("section > div").forEach((el) => {
      el.classList.add("transition-all", "duration-1000", "opacity-0", "translate-y-10");
      observer.observe(el);
    });

    sectionObserverRef.current = observer;
    return () => observer.disconnect();
  }, []);

  // ---- Scroll-driven vault folder ----
  useEffect(() => {
    const folder = memoryFolderRef.current;
    const wrap = vaultWrapRef.current;
    if (!folder || !wrap) return;

    const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const setVars = (p) => {
      folder.style.setProperty("--fp-zoom", easeOut(seg(p, 0, 0.35)).toFixed(4));
      folder.style.setProperty("--fp-open", easeOut(seg(p, 0.12, 0.55)).toFixed(4));
      folder.style.setProperty("--fp-p3", easeOut(seg(p, 0.3, 0.66)).toFixed(4));
      folder.style.setProperty("--fp-p2", easeOut(seg(p, 0.38, 0.74)).toFixed(4));
      folder.style.setProperty("--fp-p1", easeOut(seg(p, 0.46, 0.82)).toFixed(4));
      folder.style.setProperty("--fp-burst", easeOut(seg(p, 0.6, 0.94)).toFixed(4));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVars(1);
    } else {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const rect = wrap.getBoundingClientRect();
          const scrollable = rect.height - window.innerHeight;
          const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 1;
          setVars(p);
          ticking = false;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }
  }, []);

  // ---- Voice flow waveform ----
  useEffect(() => {
    const wave = voiceWaveRef.current;
    if (wave) {
      const BAR_COUNT = 32;
      for (let i = 0; i < BAR_COUNT * 2; i++) {
        const idx = i % BAR_COUNT;
        const bar = document.createElement("span");
        bar.style.setProperty("--wh", (34 + (idx % 8) * 7) + "%");
        bar.style.setProperty("--wd", (0.35 + (idx % 4) * 0.1) + "s");
        bar.style.setProperty("--wdel", (-(idx * 0.05)) + "s");
        wave.appendChild(bar);
      }
    }

    const FLOW_SPEED = 46;
    document.fonts.ready.then(() => {
      [
        ["flow-in-text", "flow-in-anim"],
        ["flow-out-text", "flow-out-anim"],
      ].forEach(([textId, animId]) => {
        const tp = document.getElementById(textId);
        const anim = document.getElementById(animId);
        if (!tp || !anim) return;
        const half = tp.getComputedTextLength() / 2;
        if (half > 0) {
          anim.setAttribute("values", (-half).toFixed(1) + ";0");
          anim.setAttribute("dur", (half / FLOW_SPEED).toFixed(2) + "s");
        }
      });
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flowSvgRef.current?.pauseAnimations();
    }
  }, []);

  return (
    <main className="pt-20">
      {/* ---- Hero Section ---- */}
      <section className="relative overflow-hidden hero-gradient pb-6">
        <div className="max-w-7xl mx-auto px-container-padding w-full pt-10">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="font-headline-lg text-[40px] sm:text-[56px] md:text-[84px] leading-[1.05] tracking-tight mb-8 text-primary">
              <span className="md:text-[60px]">Intelligence that</span>{" "}
              <br />
              <span className="italic font-bold text-healing-teal text-glow md:text-[72px]">
                fights with you.
              </span>
            </h1>
            <p className="font-body-lg text-[22px] text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              You fight cancer. We do the rest.
            </p>
            <div className="flex flex-wrap justify-center gap-5 mb-12">
              <Link href="/signup" className="tx-btn tx-btn--primary tx-btn--lg">
                <span className="tx-btn__inner">Try it for free</span>
              </Link>
              <Link href="/watch" className="tx-btn tx-btn--secondary tx-btn--lg">
                <span className="tx-btn__inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M10 8.8v6.4l5.4-3.2z" fill="currentColor" stroke="none" />
                  </svg>
                  Watch how it works
                </span>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4" data-stagger>
              <div className="key-chip">
                <span className="keycap keycap--md" data-autopress="true">
                  fn
                </span>
                <span className="font-body-md text-on-surface-variant text-[15px]">
                  Dictate in &lt;200 ms
                </span>
              </div>
              <div className="key-chip">
                <span className="keycap-combo" data-autopress="true">
                  <span className="keycap keycap--teal keycap--md">ctrl</span>
                  <span className="keycap-plus">+</span>
                  <span className="keycap keycap--teal keycap--md">fn</span>
                </span>
                <span className="font-body-md text-on-surface-variant text-[15px]">
                  Get work done with agents
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Voice flow */}
        <div className="voice-flow -mt-8 sm:-mt-12 lg:-mt-24" aria-hidden="true">
          <div className="voice-flow__stage">
            <div className="absolute left-[18%] top-[30%] w-[300px] h-[300px] bg-healing-teal/10 rounded-full blur-[100px]"></div>
            <div className="absolute right-[5%] top-[45%] w-[220px] h-[220px] bg-soft-lavender/30 rounded-full blur-[80px]"></div>
            <svg ref={flowSvgRef} id="voice-flow-svg" viewBox="0 0 1200 390" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path id="flow-curve-in" fill="none" d="M0.3 28C10 78.8 56.1 161.2 163.2 194.5C252.8 219.5 334.8 161.7 287.1 101.6C239.4 41.5 136.6 155.2 286.3 242.9C316.5 262.8 468.8 308.7 600 311" />
              <path id="flow-curve-out" fill="none" stroke="#034F46" strokeWidth="34" strokeLinecap="round" d="M600 311C700 336 920 252 1200 280" />
              <text fontSize="15" fontFamily="Manrope, sans-serif" fill="#1c1b1b" opacity="0.42">
                <textPath id="flow-in-text" href="#flow-curve-in" dominantBaseline="middle">
                  Umm, okay so&hellip; the doctor said my potassium was low, or maybe it was magnesium, three point something, I wrote it down somewhere&hellip; and I&apos;m supposed to take the new pill twice a day but only with food, I think&hellip; also the scan got moved to Tuesday? or was it Thursday&hellip; my sister keeps asking how I&apos;m doing and I never know what to tell her&hellip; oh and the tingling in my hands, someone said I should mention that&hellip; I really don&apos;t want to forget all of this again&hellip; Umm, okay so&hellip; the doctor said my potassium was low, or maybe it was magnesium, three point something, I wrote it down somewhere&hellip; and I&apos;m supposed to take the new pill twice a day but only with food, I think&hellip; also the scan got moved to Tuesday? or was it Thursday&hellip; my sister keeps asking how I&apos;m doing and I never know what to tell her&hellip; oh and the tingling in my hands, someone said I should mention that&hellip; I really don&apos;t want to forget all of this again&hellip;
                </textPath>
                <animate id="flow-in-anim" attributeName="x" dur="62s" values="-2850;0" repeatCount="indefinite" />
              </text>
              <text fontSize="14.5" fontFamily="Manrope, sans-serif" fontWeight="600" fill="#ffffff">
                <textPath id="flow-out-text" href="#flow-curve-out" dominantBaseline="middle">
                  Potassium came back low at 3.2 &mdash; recheck booked for Friday. New medication logged: twice daily, with food. Scan confirmed for Tuesday, 9:00 AM. Family update drafted and ready to send. Tingling in hands noted for Dr. Shen, flagged for Thursday&apos;s visit. Potassium came back low at 3.2 &mdash; recheck booked for Friday. New medication logged: twice daily, with food. Scan confirmed for Tuesday, 9:00 AM. Family update drafted and ready to send. Tingling in hands noted for Dr. Shen, flagged for Thursday&apos;s visit.
                </textPath>
                <animate id="flow-out-anim" attributeName="x" dur="40s" values="-1850;0" repeatCount="indefinite" />
              </text>
            </svg>
            <div className="voice-flow__pill">
              <div className="voice-flow__wave" ref={voiceWaveRef} id="voice-flow-wave"></div>
            </div>
            <div
              className="voice-flow__chip"
              style={{ "--fd": "0s", "--stack": "2" }}
            >
              <span className="voice-flow__chip-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 4c.6 4.4 2.3 6.1 6.7 6.7-4.4.6-6.1 2.3-6.7 6.7-.6-4.4-2.3-6.1-6.7-6.7 4.4-.6 6.1-2.3 6.7-6.7z" />
                  <path d="M18.8 14.8c.3 2.1 1.1 2.9 3.2 3.2-2.1.3-2.9 1.1-3.2 3.2-.3-2.1-1.1-2.9-3.2-3.2 2.1-.3 2.9-1.1 3.2-3.2z" opacity=".5" />
                </svg>
              </span>
              Cross-referenced with your visit notes
            </div>
            <div
              className="voice-flow__chip"
              style={{ "--fd": "4s", "--stack": "1" }}
            >
              <span className="voice-flow__chip-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
                  <path d="M8 3v4M16 3v4M3.5 10h17" />
                  <path d="M9.2 15.4l2 2 3.6-3.8" />
                </svg>
              </span>
              Recheck booked &mdash; Friday 9:00 AM
            </div>
            <div
              className="voice-flow__chip"
              style={{ "--fd": "8s", "--stack": "0" }}
            >
              <span className="voice-flow__chip-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 4.5H7A2.5 2.5 0 0 0 4.5 7v12A2.5 2.5 0 0 0 7 21.5h10a2.5 2.5 0 0 0 2.5-2.5V7A2.5 2.5 0 0 0 17 4.5h-2" />
                  <rect x="9" y="2.8" width="6" height="3.4" rx="1.2" />
                  <path d="M9.2 13.6l2 2 3.6-3.8" />
                </svg>
              </span>
              Logged for Dr. Shen
            </div>
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="py-20 px-container-padding bg-surface-container-low relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-headline-lg text-headline-lg mb-4">
              Speak. <span className="italic font-light text-healing-teal">It handles the rest.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6" data-stagger>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-soft-lavender/60 flex items-center justify-center mx-auto mb-5 text-secondary">
                <span className="mini-wave" aria-hidden="true">
                  <span style={{ "--wh": "45%", "--wd": ".38s", "--wdel": "-.1s" }}></span>
                  <span style={{ "--wh": "80%", "--wd": ".5s", "--wdel": "-.25s" }}></span>
                  <span style={{ "--wh": "55%", "--wd": ".44s", "--wdel": "-.4s" }}></span>
                  <span style={{ "--wh": "95%", "--wd": ".56s", "--wdel": "-.05s" }}></span>
                  <span style={{ "--wh": "65%", "--wd": ".4s", "--wdel": "-.3s" }}></span>
                  <span style={{ "--wh": "85%", "--wd": ".52s", "--wdel": "-.15s" }}></span>
                  <span style={{ "--wh": "50%", "--wd": ".46s", "--wdel": "-.35s" }}></span>
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2">1. Speak</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Just talk naturally &mdash; messy speech, pauses, whatever comes out.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-healing-teal/10 flex items-center justify-center mx-auto mb-5 text-healing-teal">
                <svg className="icon-graph" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                  <path d="M8.2 9.4 12 6.6m0 0 4 2.4M12 6.6v0M8.5 15.2l2.6 1.9m2 0 2.7-2" opacity=".6" />
                  <circle cx="12" cy="5.4" r="2.1" fill="currentColor" stroke="none" />
                  <circle cx="6.4" cy="11" r="2.1" fill="currentColor" stroke="none" />
                  <circle cx="17.6" cy="11" r="2.1" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="18" r="2.1" fill="currentColor" stroke="none" opacity=".7" />
                  <path d="M7.2 12.8 10.8 16.6M16.8 12.8 13.2 16.6M8.3 9.9 10.3 6.9M15.7 9.9 13.7 6.9M8.5 11 15.5 11" opacity=".45" />
                </svg>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2">2. Understand</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your agent interprets context &mdash; meds, symptoms, appointments, everything.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-alert-crimson/10 flex items-center justify-center mx-auto mb-5 text-alert-crimson">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3.2" y="4" width="6.2" height="6.2" rx="1.8" />
                  <path d="M13 6.2h7.5M13 17.8h7.5" />
                  <rect x="3.2" y="14" width="6.2" height="6.2" rx="1.8" opacity=".55" />
                  <path className="icon-draw-check" d="M5 7l1.4 1.4L9 5.8" />
                </svg>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2">3. Act</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Logs symptoms, updates your care team, or drafts responses &mdash; done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Problem Section ---- */}
      <section className="py-section-gap px-container-padding bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-6">
                Fighting cancer is hard.{" "}
                <span className="italic font-bold text-healing-teal text-glow">
                  Managing it shouldn&apos;t be.
                </span>
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">
                <b>75% of cancer patients experience cognitive impairment</b> during treatment. Why?
                It&apos;s due to the overwhelming friction of learning complex medical jargon, rigid
                medication schedules, and doctor appointments while you&apos;re exhausted.
              </p>
              <div className="space-y-7">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-error-container/60 border border-alert-crimson/10 flex items-center justify-center shrink-0 text-on-error-container">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                      <path d="M6.5 13.5a4.2 4.2 0 0 1 .6-8.35 5 5 0 0 1 9.55 1.4 3.6 3.6 0 0 1 .85 6.95" />
                      <path d="M5 17h9" opacity=".7" />
                      <path d="M8 20h9" opacity=".45" />
                      <path d="M16.5 17h2.5" opacity=".3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md mb-1.5">Foggy Memory</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Struggling to remember side effects during the high-pressure 15-minute window
                      with your oncologist.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/60 border border-secondary/10 flex items-center justify-center shrink-0 text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                      <path d="M4.5 16.5a8 8 0 1 1 15 0" />
                      <path d="M12 16.5 8.4 11.6" strokeWidth="2" />
                      <circle cx="12" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
                      <path d="M5.6 12.4h.01M8.4 8.9h.01M12 7.6h.01M15.6 8.9h.01M18.4 12.4h.01" strokeWidth="2.2" opacity=".5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md mb-1.5">Cognitive Fatigue</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Spending hours frantically trying to understand your medical reports or
                      diagnosis when you really should be resting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="w-28 h-28 mx-auto mb-6 rounded-2xl bg-white/90 shadow-lg border border-outline/5 flex items-center justify-center">
                    <img alt="Rivertide Logo" className="w-20 h-20 object-contain" src="/logo.png" />
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary">Rivertide</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">Your Wellness OS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Workflow Walkthrough ---- */}
      <section className="py-section-gap px-container-padding overflow-hidden" id="walkthrough">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-headline-lg text-headline-lg mb-4">
              <i>Beat chemobrain</i> with <span style={{ fontWeight: "normal" }}>Rivertide</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              A secure, <b>agentic voice-as-an-OS</b> tool to streamline <b>productivity</b> and
              save hours of your time
            </p>
          </div>
          <div className="space-y-32">
            {/* Step 1: Dictation */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 rounded-3xl overflow-hidden shadow-2xl border border-outline/10">
                <img
                  alt="Product Interface"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH0d4zohZwsQ7ON_iCGSNKmQEp4TohEkLRMc8Tf4e3qQcSixKQyx2v-hgUCGK6Pf4Wp30O9FWed5Y1d61oo2mj6VUsmhK5aq4c3D94E82rFs8qO2Nn0zH5RMLI41QbJlh9QTsv4sVNFR_fuveRICN09YlNrNbNRv1wj2A1lBe_INUHOwnOt_JZjvepFF-tJpYfi1qCXdIdMAGqhFixmvn7bjI-thoiNk6gLlKzNQnFI40luSnCUMGtDWNI76ydP6aWPBAdmKkf6ZwI"
                />
              </div>
              <div className="order-1 md:order-2">
                <span className="keycap keycap--lg mb-6 d-inline-block">fn</span>
                <h3 className="font-headline-lg text-headline-md mb-4">Agentic Dictation</h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                  Don&apos;t worry about finding the right words. <b>Just speak.</b> Rivertide
                  smartly transforms messy speech into clean, simple text and pastes it into the
                  text field. Write that email, appeal, or family update at <u>4x speed</u>.
                </p>
              </div>
            </div>
            {/* Step 2: Command Mode */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-1">
                <span className="keycap-combo mb-6 d-inline-flex">
                  <span className="keycap keycap--teal keycap--lg">ctrl</span>
                  <span className="keycap-plus">+</span>
                  <span className="keycap keycap--teal keycap--lg">fn</span>
                </span>
                <h3 className="font-headline-lg text-headline-md mb-4">Command Mode</h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                  <b>Your personal agent</b> with integrations. Use it to finish{" "}
                  <b>complex tasks with a single voice command</b>. Recall that side effect,
                  schedule calls on your calendar, or pull up your last PET scan results instantly
                  and securely!
                </p>
              </div>
              <div className="order-2 relative glow-card rounded-3xl">
                <div className="bg-[#18151B] rounded-3xl p-8 console-shadow border border-white/5 relative overflow-hidden min-h-[400px]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex items-start gap-4 translate-x-4">
                      <div className="w-10 h-10 rounded-full bg-alert-crimson/20 flex items-center justify-center text-alert-crimson shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M10.2 4.6 3.5 16.4a2 2 0 0 0 1.8 3.1h13.4a2 2 0 0 0 1.8-3.1L13.8 4.6a2 2 0 0 0-3.6 0z" />
                          <path d="M12 9.5v4" />
                          <circle cx="12" cy="16.4" r="1.1" fill="currentColor" stroke="none" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1">
                          Your last dose for Herceptin was <u>4.0 mg</u>, taken yesterday
                        </h4>
                        <p className="text-white/60 text-xs leading-relaxed">
                          I noticed (on your calendar) your call with Dr. Shen on the new dosage.
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex items-start gap-4 -translate-x-2">
                      <div className="w-10 h-10 rounded-full bg-healing-teal/20 flex items-center justify-center text-healing-teal shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
                          <path d="M8 3v4M16 3v4M3.5 10h17" />
                          <path d="M9.2 15.4l2 2 3.6-3.8" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1">
                          Follow-up call confirmed for Thursday 2:30 PM
                        </h4>
                        <p className="text-white/60 text-xs leading-relaxed">
                          &ldquo;Herceptin dosage&rdquo; clarification added to question list for
                          your call.&nbsp;
                        </p>
                      </div>
                    </div>
                    <div className="mt-12 flex items-center gap-3 border-t border-white/5 pt-8">
                      <span className="text-healing-teal font-label-caps text-sm">/</span>
                      <span className="text-white/80 font-body-md animate-pulse">
                        What was my last dosage of Herceptin again?
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-healing-teal/10 blur-[80px] rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Agentic Memory: Vault ---- */}
      <section className="bg-primary relative" id="vault-section">
        <div className="vault-pin-wrap px-container-padding" ref={vaultWrapRef}>
          <div className="vault-sticky max-w-7xl mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-primary mb-5">
              A Personal Assistant That{" "}
              <span style={{ fontWeight: "normal" }}>
                <i>Remembers For You</i>
              </span>
              .
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary/80 max-w-3xl mx-auto mb-24">
              Rivertide builds a secure, encrypted knowledge graph of your journey. Every self-note
              and detail is mapped, making your experience personalized with full control.
            </p>
            <div className="folder-container mt-16" id="memory-folder" ref={memoryFolderRef}>
              <div className="folder-back">
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
                </div>
                <div className="absolute bottom-8 left-8 text-left">
                  <p className="text-healing-teal/60 font-label-caps text-[11px] mb-1 tracking-widest">
                    ENCRYPTED STORAGE
                  </p>
                  <p className="text-primary font-headline-md text-lg">PATIENT_SECURE_VAULT_V1</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-healing-teal/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="clinical-page page-3 p-8 text-left border border-outline/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-healing-teal/10 p-2 rounded-lg text-healing-teal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
                      <path d="M14 3.5V8.5H19" />
                      <path d="M8.5 13h7M8.5 16.5h4.5" />
                    </svg>
                  </div>
                  <span className="font-bold text-primary text-md">Pathology Report</span>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-surface-container-high rounded-full"></div>
                  <div className="h-2 w-3/4 bg-surface-container-high rounded-full"></div>
                  <div className="h-2 w-5/6 bg-surface-container-high rounded-full"></div>
                </div>
              </div>
              <div className="clinical-page page-2 p-8 text-left border border-outline/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-healing-teal/10 p-2 rounded-lg text-healing-teal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 4.5H7A2.5 2.5 0 0 0 4.5 7v12A2.5 2.5 0 0 0 7 21.5h10a2.5 2.5 0 0 0 2.5-2.5V7A2.5 2.5 0 0 0 17 4.5h-2" />
                      <rect x="9" y="2.8" width="6" height="3.4" rx="1.2" />
                      <path d="M8.5 12h7M8.5 15.5h4.5" />
                    </svg>
                  </div>
                  <span className="font-bold text-primary text-md">Insurance Claim #8821</span>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-surface-container-high rounded-full"></div>
                  <div className="h-2 w-1/2 bg-surface-container-high rounded-full"></div>
                </div>
              </div>
              <div className="clinical-page page-1 p-8 text-left border border-outline/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg text-healing-teal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="4" y="7" width="16" height="12.5" rx="2.5" />
                      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
                      <path d="M12 11v4M10 13h4" />
                    </svg>
                  </div>
                  <span className="font-bold text-primary text-md">Clinical Notes</span>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-surface-container-high rounded-full"></div>
                  <div className="h-2 w-2/3 bg-surface-container-high rounded-full"></div>
                </div>
                <div className="mt-8 p-4 bg-healing-teal/5 border border-healing-teal/10 rounded-xl">
                  <p className="text-[12px] text-healing-teal italic leading-relaxed">
                    &ldquo;Patient reports improved tolerance. Optimized rest cycle recommended.&rdquo;
                  </p>
                </div>
              </div>
              <div className="burst-document">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-healing-teal/10 p-1.5 rounded-lg text-healing-teal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
                      <path d="M14 3.5V8.5H19" />
                      <path d="M8.5 13h7M8.5 16.5h4.5" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-primary">Quick Note</span>
                </div>
                <div className="space-y-2.5">
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full"></div>
                  <div className="h-1.5 w-4/5 bg-surface-container-high rounded-full"></div>
                  <div className="h-1.5 w-3/4 bg-surface-container-high rounded-full"></div>
                  <div className="h-1.5 w-5/6 bg-surface-container-high rounded-full"></div>
                  <div className="h-1.5 w-2/3 bg-surface-container-high rounded-full"></div>
                </div>
                <div className="mt-5 pt-4 border-t border-surface-container-high/50 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-healing-teal/20 flex items-center justify-center text-healing-teal">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </div>
                  <span className="text-[9px] text-healing-teal font-bold tracking-[0.15em]">
                    AUTO-SAVED TO VAULT
                  </span>
                </div>
              </div>
              <div className="folder-front flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mb-4 mx-auto backdrop-blur-sm border border-healing-teal/15 shadow-sm text-healing-teal">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
                      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
                      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <p className="text-healing-teal font-label-caps text-xs tracking-[0.2em]">Your Files</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-container-padding pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full" data-stagger>
            <div className="bg-primary-container/40 p-6 rounded-2xl border border-on-primary/10 backdrop-blur-md text-primary-fixed">
              <svg className="icon-graph mb-4" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="5.4" r="2.1" fill="currentColor" stroke="none" />
                <circle cx="6.4" cy="11" r="2.1" fill="currentColor" stroke="none" />
                <circle cx="17.6" cy="11" r="2.1" fill="currentColor" stroke="none" />
                <circle cx="12" cy="18" r="2.1" fill="currentColor" stroke="none" opacity=".7" />
                <path d="M7.2 12.8 10.8 16.6M16.8 12.8 13.2 16.6M8.3 9.9 10.3 6.9M15.7 9.9 13.7 6.9M8.5 11 15.5 11" opacity=".45" />
              </svg>
              <h4 className="text-on-primary font-headline-md text-body-md mb-2">Connected Data</h4>
            </div>
            <div className="bg-primary-container/40 p-6 rounded-2xl border border-on-primary/10 backdrop-blur-md text-primary-fixed">
              <svg className="mb-4" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3.5l7 2.6v5.2c0 4.6-3 7.7-7 9.2-4-1.5-7-4.6-7-9.2V6.1z" />
                <path d="M8.8 12l2.2 2.2 4.2-4.4" />
              </svg>
              <h4 className="text-on-primary font-headline-md text-body-md mb-2">HIPAA Secure</h4>
            </div>
            <div className="bg-primary-container/40 p-6 rounded-2xl border border-on-primary/10 backdrop-blur-md text-primary-fixed">
              <svg className="mb-4" width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 4c.6 4.4 2.3 6.1 6.7 6.7-4.4.6-6.1 2.3-6.7 6.7-.6-4.4-2.3-6.1-6.7-6.7 4.4-.6 6.1-2.3 6.7-6.7z" />
                <path d="M18.8 14.8c.3 2.1 1.1 2.9 3.2 3.2-2.1.3-2.9 1.1-3.2 3.2-.3-2.1-1.1-2.9-3.2-3.2 2.1-.3 2.9-1.1 3.2-3.2z" opacity=".5" />
              </svg>
              <h4 className="text-on-primary font-headline-md text-body-md mb-2">Context Aware Agents</h4>
            </div>
            <div className="bg-primary-container/40 p-6 rounded-2xl border border-on-primary/10 backdrop-blur-md text-primary-fixed">
              <svg className="mb-4" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M4 8h9M17.5 8H20" />
                <circle cx="15" cy="8" r="2.2" />
                <path d="M4 16h2.5M11 16H20" />
                <circle cx="8.5" cy="16" r="2.2" />
              </svg>
              <h4 className="text-on-primary font-headline-md text-body-md mb-2">You have full control</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Cognitive Health Monitor ---- */}
      <section className="py-section-gap px-container-padding">
        <div className="max-w-7xl mx-auto">
          <div className="bento-grid">
            <div className="col-span-12 md:col-span-8 bg-surface-container-high rounded-3xl p-10 flex flex-col justify-between">
              <div>
                <h3 className="font-headline-lg text-headline-lg mb-4">
                  Track Mental Health, <span style={{ fontWeight: "normal" }}>pain-free</span>
                </h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl">
                  Rivertide uses <b>sub-audible voice analytics</b> to track linguistic markers of
                  cognitive fatigue. We <b>alert you before the &ldquo;fog&rdquo;</b> settles in so
                  you know what to expect.
                </p>
              </div>
              <div className="h-48 w-full bg-white/50 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-end gap-1 h-full opacity-30">
                  <div className="flex-1 bg-healing-teal rounded-t" style={{ height: "40%" }}></div>
                  <div className="flex-1 bg-healing-teal rounded-t" style={{ height: "60%" }}></div>
                  <div className="flex-1 bg-healing-teal rounded-t" style={{ height: "30%" }}></div>
                  <div className="flex-1 bg-healing-teal rounded-t" style={{ height: "80%" }}></div>
                  <div className="flex-1 bg-alert-crimson rounded-t" style={{ height: "95%" }}></div>
                  <div className="flex-1 bg-alert-crimson rounded-t" style={{ height: "90%" }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass-panel px-6 py-4 rounded-full border border-alert-crimson flex items-center gap-3 shadow-xl text-alert-crimson">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10.2 4.6 3.5 16.4a2 2 0 0 0 1.8 3.1h13.4a2 2 0 0 0 1.8-3.1L13.8 4.6a2 2 0 0 0-3.6 0z" />
                      <path d="M12 9.5v4" />
                      <circle cx="12" cy="16.4" r="1.1" fill="currentColor" stroke="none" />
                    </svg>
                    <span className="font-headline-md text-body-md text-alert-crimson font-bold">
                      HIGH cognitive load
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 bg-soft-lavender rounded-3xl p-10 flex flex-col items-center text-center justify-center border border-secondary/10 glow-card">
              <div className="w-24 h-24 rounded-full bg-white mb-6 flex items-center justify-center shadow-lg text-healing-teal">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19.5 14.2A7.8 7.8 0 0 1 9.8 4.5a7.8 7.8 0 1 0 9.7 9.7z" fill="currentColor" fillOpacity=".12" />
                  <path d="M15 4.5h4l-4 4h4" opacity=".55" strokeWidth="1.4" />
                </svg>
              </div>
              <h4 className="font-headline-md text-headline-md mb-4 text-healing-teal">
                Advised: Take a 20m Nap
              </h4>
              <p className="font-body-md text-body-md text-on-secondary-fixed-variant">
                Rivertide is built with automatic mental health tracking just for you. Measure your
                cognitive response to treatment and discuss it with your doctor. <b>100% private</b>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Adaptive Agents ---- */}
      <section className="py-section-gap px-container-padding bg-surface-container-low" id="support">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-headline-lg mb-4">Adaptive Agents</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              A chat interface with adaptive UI based on your cognitive fatigue levels.
            </p>
            <div className="max-w-md mx-auto flex flex-col gap-3 mb-12">
              <div className="flex justify-between font-body-md text-[13px] italic text-on-surface-variant/50">
                <span>focused</span>
                <span>foggy</span>
              </div>
              <input
                className="cognitive-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={cognitiveLoad}
                onChange={(e) => setCognitiveLoad(Number(e.target.value))}
                style={{
                  "--thumb-color": currentZone.color,
                  "--thumb-glow": currentZone.glow,
                }}
              />
              <p
                ref={cognitiveHintRef}
                className="font-body-md text-[14px] mt-1 text-center transition-colors duration-300"
                style={{ color: currentZone.color }}
              >
                {currentZone.hint}
              </p>
            </div>
          </div>
          <div className="glass-panel rounded-3xl border border-outline/10 shadow-2xl overflow-hidden h-[600px] flex flex-col">
            <div className="p-6 border-b border-outline/10 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full agent-gradient flex items-center justify-center overflow-hidden border border-white/20">
                  <img alt="Logo" className="w-8 h-8 object-contain" src="/logo.png" />
                </div>
                <div>
                  <p className="font-headline-md text-body-md font-bold">Rivertide Agent</p>
                  <p className="text-[10px] text-on-surface-variant font-label-caps tracking-widest opacity-60">
                    just a demo...
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-surface/30" id="chat-messages">
              <div className="flex justify-end">
                <div className="bg-healing-teal text-white px-6 py-4 rounded-2xl rounded-tr-none max-w-[80%]">
                  <p className="font-body-md">
                    &ldquo;I&apos;m feeling overwhelmed with all these diagnosis papers. What do I
                    actually need to do today?&rdquo;
                  </p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white border border-outline-variant px-6 py-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                  <p ref={agentIntroRef} className="font-body-md text-on-surface mb-3">
                    I&apos;ve scanned the 14 pages. There is only one high-priority task for you:
                  </p>
                  <div className="bg-soft-lavender/40 p-4 rounded-xl border border-soft-lavender flex items-center gap-4">
                    <span className="text-secondary shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M16.8 3.8a2 2 0 0 1 2.8 2.8L9 17.2l-3.8 1 1-3.8z" />
                        <path d="M4 21c2.5-1.6 4.5.9 7 0s4-1.2 6 0" opacity=".55" />
                      </svg>
                    </span>
                    <p className="font-body-md font-bold text-on-surface">
                      Sign the Prior Authorization on page 3.
                    </p>
                  </div>
                  <div
                    ref={complexDetailsRef}
                    className={cognitiveLoad > 60 ? "hidden" : "mt-3 pt-3 border-t border-outline/5"}
                    id="complex-details"
                  >
                    <p className="text-[13px] text-on-surface-variant mb-2">
                      The authorization refers to the HCPCS code J9312 for your next infusion
                      cycle. I&apos;ve cross-referenced this with your provider network, and it is
                      fully covered.
                    </p>
                    <div className="flex gap-2">
                      <button className="text-[11px] font-bold text-healing-teal underline">
                        View full analysis
                      </button>
                      <button className="text-[11px] font-bold text-healing-teal underline">
                        Download PDF
                      </button>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface mt-3">
                    I&apos;ve handled the rest of the scanning and added a breakdown to your Google
                    Docs. Ready to rest?
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white/50 border-t border-outline/10">
              <div className="relative">
                <input
                  className="w-full bg-surface p-4 pr-16 rounded-2xl border-2 border-outline-variant focus:border-healing-teal focus:ring-0 font-body-md transition-all"
                  placeholder="Type or use 'fn' to speak..."
                  type="text"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <button className="tx-btn tx-btn--accent tx-btn--icon" aria-label="Speak">
                    <span className="tx-btn__inner">
                      <span className="mini-wave" aria-hidden="true" style={{ height: "18px" }}>
                        <span style={{ "--wh": "50%", "--wd": ".42s", "--wdel": "-.1s", width: "3px" }}></span>
                        <span style={{ "--wh": "90%", "--wd": ".5s", "--wdel": "-.3s", width: "3px" }}></span>
                        <span style={{ "--wh": "60%", "--wd": ".46s", "--wdel": "-.2s", width: "3px" }}></span>
                        <span style={{ "--wh": "80%", "--wd": ".54s", "--wdel": "-.05s", width: "3px" }}></span>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Marquee ---- */}
      <section className="py-20 bg-surface border-t border-outline/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-container-padding">
          <h2 className="text-center font-headline-md text-headline-md mb-12 text-on-surface">
            Integrates with <span className="italic text-healing-teal">your care network</span>
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <div className="marquee-container relative">
                <div className="marquee-content">
                  <div className="marquee-group grayscale opacity-60">
                    <span className="font-headline-md text-3xl font-bold tracking-tight">HealthConnect</span>
                    <span className="font-headline-md text-3xl font-bold tracking-tight">Epic</span>
                    <span className="font-headline-md text-3xl font-bold tracking-tight">MyChart</span>
                    <span className="font-headline-md text-3xl font-bold tracking-tight">Oscar</span>
                    <span className="font-headline-md text-3xl font-bold tracking-tight">Humana</span>
                  </div>
                  <div className="marquee-group grayscale opacity-60" aria-hidden="true">
                    <span className="font-headline-md text-3xl font-bold tracking-tight">HealthConnect</span>
                    <span className="font-headline-md text-3xl font-bold tracking-tight">Epic</span>
                    <span className="font-headline-md text-3xl font-bold tracking-tight">MyChart</span>
                    <span className="font-headline-md text-3xl font-bold tracking-tight">Oscar</span>
                    <span className="font-headline-md text-3xl font-bold tracking-tight">Humana</span>
                  </div>
                </div>
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="py-section-gap px-container-padding text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg mb-6">
            Stop managing. Start healing.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
            Join 1,200+ patients who save an average of 14 hours a week on medical administration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="tx-btn tx-btn--primary tx-btn--lg">
              <span className="tx-btn__inner">Start Your 14-Day Calm</span>
            </Link>
            <Link href="/watch" className="tx-btn tx-btn--secondary tx-btn--lg">
              <span className="tx-btn__inner">View Demo</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
