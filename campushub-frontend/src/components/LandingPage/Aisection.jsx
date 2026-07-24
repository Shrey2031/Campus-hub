import { motion } from "framer-motion";

const Aisection = () => {
  return (
    <section id="ai" className="bg-ink py-24 border-b-2 border-dashed border-ink/40">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs tracking-widest text-highlighter uppercase mb-3">Powered by Gemini</p>
          <h2 className="font-display font-bold text-paper text-3xl md:text-4xl mb-6 leading-tight">
            AI office hours.<br />Available at 2 AM too.
          </h2>
          <p className="font-body text-paper/70 text-lg leading-relaxed mb-8 max-w-md">
            Paste a doubt, get a real explanation — with examples, not just a
            textbook definition. It remembers the conversation, so you can
            keep asking "wait, why though?"
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 bg-highlighter text-ink font-body font-semibold px-6 py-3.5 rounded hover:bg-paper transition-colors"
          >
            Ask Gemini AI now →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-paper rounded-sm p-5 shadow-2xl"
        >
          <div className="flex justify-end mb-4">
            <p className="bg-ink text-paper font-body text-sm px-4 py-2.5 rounded-lg rounded-br-none max-w-[85%]">
              Explain binary search tree with an example.
            </p>
          </div>
          <div className="flex gap-3 mb-4">
            <span className="w-7 h-7 rounded-full bg-highlighter flex items-center justify-center text-xs font-bold shrink-0">
              AI
            </span>
            <p className="bg-paper border border-ink/10 font-body text-sm text-ink px-4 py-2.5 rounded-lg rounded-tl-none leading-relaxed">
              A BST is a node-based tree where each node has at most two
              children — everything smaller goes left, everything larger
              goes right. So searching means cutting the problem in half
              every step.
            </p>
          </div>
          <div className="flex justify-end">
            <p className="bg-ink/5 text-ink font-body text-sm px-4 py-2.5 rounded-lg rounded-br-none max-w-[85%]">
              That makes sense, thanks 🙂
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Aisection;