export default function CTA() {
  return (
    <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        <div className="text-white max-w-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
            Ready to learn, share, and grow together?
          </h2>
          <p className="text-indigo-200 text-base">
            Join CampusHub today and be part of the future of learning.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg">
              Get Started for Free →
            </button>
            <button className="px-6 py-3 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200">
              Explore Features
            </button>
          </div>
        </div>

        {/* Decorative graduation cap */}
        <div className="text-9xl select-none opacity-80">🎓</div>
      </div>
    </section>
  );
}