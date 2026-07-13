import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-20 bg-primary">
      <div className="flex flex-col md:flex-row justify-between items-center px-container-padding max-w-7xl mx-auto">
        <div className="mb-8 md:mb-0">
          <Link
            href="/"
            className="font-headline-md text-headline-md text-secondary-fixed mb-2 font-bold flex items-center gap-3"
          >
            <img
              alt="Rivertide Logo"
              className="w-10 h-10 object-contain invert brightness-0"
              src="/logo.png"
            />
            Rivertide
          </Link>
          <p className="text-label-md text-on-primary/70">
            &copy; 2026 Rivertide &middot; Built by CodeTheCure Labs
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <Link
            className="font-body-md text-body-md text-on-primary/70 hover:text-secondary-fixed transition-opacity opacity-80 hover:opacity-100"
            href="/"
          >
            Features
          </Link>
          <Link
            className="font-body-md text-body-md text-on-primary/70 hover:text-secondary-fixed transition-opacity opacity-80 hover:opacity-100"
            href="/agents"
          >
            Agents
          </Link>
          <a
            className="font-body-md text-body-md text-on-primary/70 hover:text-secondary-fixed transition-opacity opacity-80 hover:opacity-100"
            href="https://www.codethecure.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About us
          </a>
        </div>
      </div>
    </footer>
  );
}
