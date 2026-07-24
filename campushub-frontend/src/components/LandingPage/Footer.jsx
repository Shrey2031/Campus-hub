import { BookOpen, Mail } from "lucide-react";

// lucide-react dropped brand icons (Github, Linkedin, etc.) in recent
// versions, so these are small inline SVGs instead of a package import.
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.2 2.4 4.2 5.5v6.2ZM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1ZM7.1 20.4H3.6V9h3.5v11.4Z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-paper border-t-2 border-dashed border-ink/20 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          <div>
            <a href="#" className="flex items-center gap-2 font-display font-bold text-lg text-ink mb-3">
              <span className="w-7 h-7 rounded bg-ink text-paper flex items-center justify-center">
                <BookOpen size={14} strokeWidth={2.5} />
              </span>
              Campus<span className="text-redpen">Hub</span>
            </a>
            <p className="font-body text-sm text-ink-soft max-w-xs">
              Notes, PYQs, and doubt-solving — built for students, by a student.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-mono text-xs tracking-widest text-ink-soft uppercase mb-3">Product</p>
              <ul className="space-y-2 font-body text-sm text-ink/80">
                <li><a href="#features" className="hover:text-redpen">Features</a></li>
                <li><a href="#ai" className="hover:text-redpen">AI Assistant</a></li>
                <li><a href="#community" className="hover:text-redpen">Community</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest text-ink-soft uppercase mb-3">Connect</p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/Shrey2031"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded border border-ink/15 flex items-center justify-center hover:border-redpen hover:text-redpen"
                >
                  <GithubIcon />
                </a>
                <a href="#" className="w-9 h-9 rounded border border-ink/15 flex items-center justify-center hover:border-redpen hover:text-redpen">
                  <LinkedinIcon />
                </a>
                <a
                  href="mailto:shreyakumari44611@gmail.com"
                  className="w-9 h-9 rounded border border-ink/15 flex items-center justify-center hover:border-redpen hover:text-redpen"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-ink/15 pt-6 flex flex-col sm:flex-row justify-between gap-2">
          <p className="font-mono text-xs text-ink-soft">© 2026 CampusHub. Built solo, MERN stack.</p>
          <p className="font-mono text-xs text-ink-soft">Patna, India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;