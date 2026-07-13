import Link from "next/link";

export default function WatchPage() {
  return (
    <main className="pt-20 min-h-[calc(100vh-5rem)] flex items-center">
      <section className="w-full py-section-gap px-container-padding hero-gradient min-h-[calc(100vh-5rem)] flex items-center">
        <div className="max-w-3xl mx-auto w-full text-center">
          <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-8 border border-outline/5">
            <span
              className="material-symbols-outlined text-healing-teal text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_circle
            </span>
          </div>

          <h1 className="font-headline-lg text-headline-lg mb-4">
            Video Preview{" "}
            <span className="italic font-light text-healing-teal">Coming Soon</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-12">
            We&apos;re putting the finishing touches on our demo video. Check back soon to see
            Rivertide in action &mdash; or join the waitlist to be the first to know when
            it&apos;s live.
          </p>

          <div className="glass-panel rounded-3xl border border-outline/10 shadow-2xl overflow-hidden max-w-2xl mx-auto mb-12">
            <div className="aspect-video bg-gradient-to-br from-healing-teal/5 to-soft-lavender/5 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center coming-soon-pulse">
                  <span className="material-symbols-outlined text-healing-teal text-4xl">
                    play_arrow
                  </span>
                </div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-[11px] font-['JetBrains_Mono',monospace] text-healing-teal tracking-widest">
                  RECORDING SOON
                </span>
              </div>
            </div>
          </div>

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
