"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const ACCOUNT_KEY = "rivertide_account";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accountStr = localStorage.getItem(ACCOUNT_KEY);
    if (accountStr) {
      try {
        const account = JSON.parse(accountStr);
        setIsAuthenticated(!!account.initialized);
      } catch {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCOUNT_KEY);
    router.push("/login");
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
        {isAuthenticated ? (
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="tx-btn tx-btn--primary tx-btn--sm"
            >
              <span className="tx-btn__inner">Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="tx-btn tx-btn--secondary tx-btn--sm"
            >
              <span className="tx-btn__inner">Log Out</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="tx-btn tx-btn--primary tx-btn--sm"
          >
            <span className="tx-btn__inner">Log In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
