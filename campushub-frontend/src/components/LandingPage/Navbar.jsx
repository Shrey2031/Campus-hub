import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#ai" },
  { label: "Community", href: "#community" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b-2 border-dashed border-ink/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg text-ink">
          <span className="w-8 h-8 rounded bg-ink text-paper flex items-center justify-center">
            <BookOpen size={16} strokeWidth={2.5} />
          </span>
          Campus<span className="text-redpen">Hub</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm text-ink/80">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-ink transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="/auth" className="font-body text-sm font-medium text-ink/80 hover:text-ink px-4 py-2">
            Log in
          </a>
          <a
            href="/auth"
            className="font-body text-sm font-semibold bg-ink text-paper px-4 py-2 rounded hover:bg-redpen transition-colors"
          >
            Sign up
          </a>
        </div>

        <button className="md:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-dashed border-ink/20 bg-paper px-6 py-4 flex flex-col gap-4 font-body text-sm">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setOpen(false)} className="text-ink/80">
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-dashed border-ink/20">
            <a href="/login" className="flex-1 text-center py-2 text-ink font-medium">Log in</a>
            <a href="/signup" className="flex-1 text-center py-2 bg-ink text-paper rounded font-semibold">Sign up</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;