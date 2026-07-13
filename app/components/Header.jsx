"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="floating-header">
      <div className="floating-header__row max-w-7xl mx-auto px-container-padding w-full gap-4">
        <Link href="/" className="brand-chip font-bold text-primary">
          <img
            alt="Rivertide Logo"
            className="w-9 h-9 object-contain"
            src="/logo.png"
          />
          <span className="text-lg tracking-tight">Rivertide</span>
        </Link>
        <nav aria-label="Primary" className="spotlight-nav hidden md:block">
          <div className="spotlight-nav__spot"></div>
          <div className="spotlight-nav__amb"></div>
          <ul>
            <li>
              <Link
                href="/"
                data-active={isActive("/") && pathname === "/" ? true : undefined}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/agents"
                data-active={isActive("/agents") ? true : undefined}
              >
                Agents
              </Link>
            </li>
            <li>
              <a
                href="https://www.codethecure.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About us
              </a>
            </li>
          </ul>
        </nav>
        <Link
          href="/signup"
          className="tx-btn tx-btn--primary tx-btn--sm"
        >
          <span className="tx-btn__inner">Sign up for free</span>
        </Link>
      </div>
    </header>
  );
}
