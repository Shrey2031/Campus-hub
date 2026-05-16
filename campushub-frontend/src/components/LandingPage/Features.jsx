const features = [
  {
    icon: "📄",
    title: "Share & Access Notes",
    desc: "Upload your notes or explore high-quality notes shared by students like you.",
    badge: null,
  },
  {
    icon: "📚",
    title: "PYQ Library",
    desc: "Access a vast collection of previous year papers semester-wise and subject-wise.",
    badge: null,
  },
  {
    icon: "✨",
    title: "Ask Gemini AI",
    desc: "Get instant, accurate answers to your questions with Gemini AI.",
    badge: "New",
  },
  {
    icon: "💬",
    title: "Real-time Discussions",
    desc: "Join live discussions, ask doubts, and collaborate in real-time with Socket.io.",
    badge: "Live",
  },
  {
    icon: "👥",
    title: "Groups",
    desc: "Create or join study groups based on your course, subject, or exam.",
    badge: null,
  },
  {
    icon: "❤️",
    title: "Like & Comment",
    desc: "Engage with posts, like helpful content, and comment to start conversations.",
    badge: null,
  },
  {
    icon: "🔖",
    title: "Bookmarks",
    desc: "Save important notes, PYQs, and posts for quick access anytime.",
    badge: null,
  },
  {
    icon: "🔍",
    title: "Smart Search",
    desc: "Find exactly what you need with powerful filters and smart search.",
    badge: null,
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-indigo-600 text-sm font-semibold tracking-widest uppercase">
            Everything you need
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
            All-in-one platform for every learner
          </h2>
          <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
            Access learning resources, get AI help, and connect with peers—anytime, anywhere.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc, badge }) => (
            <div
              key={title}
              className="relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              {badge && (
                <span
                  className={`absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    badge === "New"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {badge}
                </span>
              )}
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-100 transition-colors">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}