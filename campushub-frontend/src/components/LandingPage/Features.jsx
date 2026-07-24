import { motion } from "framer-motion";
import { Rss, FileText, ScrollText, Sparkles, MessagesSquare } from "lucide-react";

const periods = [
  {
    period: "Period 1",
    icon: Rss,
    title: "Doubt Feed",
    desc: "Post a doubt with code or a screenshot — like a status update. Get comments, replies, and likes from students who've been there.",
    span: true,
  },
  {
        period: "Period 2",
    icon: FileText,
    title: "Notes & Resources",
    desc: "Upload your notes, or grab high-quality ones shared by students in your subject.",
  },
  {
    period: "Period 3",
    icon: ScrollText,
    title: "PYQ Library",
    desc: "Previous year papers, sorted by semester and subject — no more scattered PDFs.",
  },
  {
    period: "Period 4",
    icon: Sparkles,
    title: "Ask Gemini AI",
    desc: "Stuck on a concept? Get an explanation with examples, not just a one-line definition.",
  },
  {
    period: "Period 5",
    icon: MessagesSquare,
    title: "Live Discussions",
    desc: "Real-time, subject-wise chat rooms — see who's online and ask right now.",
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-paper py-24 border-b-2 border-dashed border-ink/20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs tracking-widest text-redpen uppercase mb-3">Your day, timetabled</p>
        <h2 className="font-display font-bold text-ink text-3xl md:text-4xl max-w-xl mb-16">
          Everything you'd otherwise have four different tabs open for.
        </h2>

        <div className="grid md:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
          {periods.map(({ period, icon: Icon, title, desc, span }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`bg-paper p-8 hover:bg-white transition-colors ${span ? "md:col-span-2" : ""}`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">{period}</span>
                <Icon size={20} className="text-ink/50" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-ink text-xl mb-2">{title}</h3>
              <p className="font-body text-ink-soft leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;