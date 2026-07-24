import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
// Swap this to an actual screenshot of your app (e.g. the feed/dashboard
// view) — a real product screenshot lands much better here than an
// abstract graphic. Save it in src/assets and update the path below.
import heroImg from "../../assets/hero.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-paper pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="font-mono text-xs tracking-widest text-ink-soft uppercase mb-6">
            CH · Sem 6 · Built by a student
          </p>

          <h1 className="font-display font-bold text-ink text-[2.75rem] leading-[1.05] md:text-6xl md:leading-[1.05] mb-6">
            Stop hunting for notes<br />
            at <span className="marker">2 AM</span>.
          </h1>

          <p className="font-body text-ink-soft text-lg leading-relaxed max-w-md mb-8">
            Post a doubt and get real replies — not just likes. Upload notes,
            browse PYQs by semester, or ask Gemini AI when nobody's answered
            yet. One feed instead of five WhatsApp groups.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/signup"
              className="group flex items-center gap-2 bg-ink text-paper font-body font-semibold px-6 py-3.5 rounded hover:bg-redpen transition-colors"
            >
              Get started — it's free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#ai"
              className="flex items-center gap-2 font-body font-medium text-ink px-2 py-3.5 border-b-2 border-ink/30 hover:border-redpen hover:text-redpen transition-colors"
            >
              <PlayCircle size={18} />
              See how it works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotate: -6, scale: 0.95 }}
          animate={{ opacity: 1, rotate: -3, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="bg-white p-3 pb-6 rounded-sm shadow-[0_20px_50px_-15px_rgba(22,33,58,0.35)] rotate-[-3deg] border border-ink/10">
            <img
              src={heroImg}
              alt="CampusHub feed showing notes, doubts, and live discussion"
              className="w-full rounded-sm"
            />
          </div>
          <div className="absolute -top-4 -right-4 bg-redpen text-paper font-mono text-xs px-3 py-1.5 rounded rotate-6 shadow-md">
            live now
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;