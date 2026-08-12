import Link from "next/link";
import MacbookPro from "../components/ui/macbook-pro";

export default function WatchPage() {
  return (
    <main className="pt-20 min-h-[calc(100vh-5rem)] flex items-center">
      <section className="w-full py-section-gap px-container-padding hero-gradient min-h-[calc(100vh-5rem)] flex items-center">
        <div className="max-w-4xl mx-auto w-full text-center">
          <h1 className="font-headline-lg text-headline-lg mb-4">
            Video Preview{" "}
            <span className="italic font-light text-healing-teal">Rivertide in action</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-12">
            Watch how messy patient speech becomes organized notes, care coordination, and
            calm &mdash; in under 200 ms.
          </p>

          <div className="max-w-3xl mx-auto mb-12">
            <MacbookPro className="w-full h-auto text-black">
              <video
                className="h-full w-full object-cover"
                src="/videos/RiverTideLaunch.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-label="Rivertide launch reel"
              />
            </MacbookPro>
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
