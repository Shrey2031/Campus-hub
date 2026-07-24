import { ArrowRight } from "lucide-react";

const Cta = () => {
  return (
    <section className="bg-ink py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-paper text-3xl md:text-5xl leading-tight mb-6">
          Ready for <span className="marker-dark">finals</span>?
        </h2>
        <p className="font-body text-paper/70 text-lg mb-10 max-w-md mx-auto">
          Create an account in under a minute. No fee, no catch.
        </p>
        <a
          href="/signup"
          className="inline-flex items-center gap-2 bg-highlighter text-ink font-body font-semibold px-8 py-4 rounded hover:bg-paper transition-colors"
        >
          Get started for free
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default Cta;