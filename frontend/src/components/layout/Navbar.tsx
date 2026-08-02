import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Signals", href: "#signals" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Research", href: "#research" },
  { label: "Prototype", href: "#prototype" },
];

/**
 * Fixed top navigation with the AlphaLens wordmark, primary section links,
 * and a Github action. Collapses into a slide-down menu below the `sm`
 * breakpoint.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="font-mono-tight text-sm font-semibold tracking-widest text-text">
          ALPHALENS <span className="text-primary">AI</span>
        </a>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors duration-200 hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-text"
            aria-label="View AlphaLens AI on Github"
          >
            <Github size={16} />
            Github
          </a>
        </div>

        <button
          type="button"
          className="flex items-center justify-center text-text sm:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="border-t border-white/10 bg-background sm:hidden"
        >
          <Container className="flex flex-col gap-4 py-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors duration-200 hover:text-text"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-text"
            >
              <Github size={16} />
              Github
            </a>
          </Container>
        </motion.nav>
      )}
    </header>
  );
}
