import { motion } from "framer-motion";

const rooms = [
  { tag: "DSA", title: "Doubt Solving", online: 45, rotate: "-rotate-2" },
  { tag: "DB", title: "Database Normalization", online: 32, rotate: "rotate-1" },
  { tag: "OS", title: "Process Synchronization", online: 28, rotate: "-rotate-1" },
  { tag: "CN", title: "Important Questions", online: 19, rotate: "rotate-2" },
];

const Community = () => {
  return (
    <section id="community" className="bg-paper py-24 border-b-2 border-dashed border-ink/20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs tracking-widest text-redpen uppercase mb-3">The noticeboard's always on</p>
        <h2 className="font-display font-bold text-ink text-3xl md:text-4xl max-w-xl mb-16">
          Join a room, ask your doubt, get an answer before you finish typing it.
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {rooms.map(({ tag, title, online, rotate }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`bg-white border border-ink/10 rounded-sm p-5 shadow-md ${rotate} hover:rotate-0 transition-transform`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs bg-ink text-paper px-2 py-1 rounded">{tag}</span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-ink-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-redpen" />
                  {online} online
                </span>
              </div>
              <h3 className="font-display font-bold text-ink">{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;