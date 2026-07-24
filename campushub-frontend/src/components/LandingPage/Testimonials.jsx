const tech = ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Gemini API", "JWT"];

const Testimonials = () => {
  return (
    <section className="bg-paper py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white border-2 border-dashed border-ink/25 rounded-sm p-10 md:p-12">
          <p className="font-mono text-xs tracking-widest text-redpen uppercase mb-6">A note from the builder</p>
          <p className="font-display text-ink text-2xl md:text-3xl leading-snug mb-8">
            "I built CampusHub solo — front to back — because I was tired of
            having notes in one app, PYQs in a Telegram group, and doubts
            going unanswered for days."
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {tech.map((t) => (
              <span key={t} className="font-mono text-xs text-ink-soft border border-ink/15 px-3 py-1.5 rounded">
                {t}
              </span>
            ))}
          </div>
          <p className="font-body text-ink font-semibold">— Shreya, final-year CS</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;