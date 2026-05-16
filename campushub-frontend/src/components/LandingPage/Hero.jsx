
import { useNavigate } from "react-router-dom";

export default function Hero() {
   const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 pt-20 pb-0 overflow-hidden relative">
      {/* Background decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-0 flex flex-col lg:flex-row items-center gap-12">
        {/* Left: Text */}
        <div className="flex-1 text-white">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            🎓 Built for Distance & Online Students
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Learn. Share.{" "}
            <br />
            Succeed—
            <span className="text-yellow-400">Together.</span>
          </h1>

          <p className="text-indigo-200 text-lg leading-relaxed max-w-lg mb-8">
            CampusHub is your all-in-one platform to access notes, PYQs, ask questions,{" "}
            <span className="text-white font-medium">join discussions</span>, and grow with a
            community of learners—powered by Gemini AI.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <button 
              onClick={() => navigate("/auth")}  
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-indigo-900/30">
              Get Started for Free →
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Explore Features
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-pink-400", "bg-blue-400", "bg-green-400", "bg-yellow-400"].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${c} border-2 border-indigo-800 flex items-center justify-center text-xs font-bold text-white`}
                >
                  {["P", "R", "A", "S"][i]}
                </div>
              ))}
            </div>
            <p className="text-indigo-200 text-sm">
              Join <span className="text-white font-semibold">50,000+</span> students already growing together
            </p>
          </div>
        </div>

        {/* Right: Dashboard mockup */}
        <div className="flex-1 max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden border border-white/10">
            {/* Top bar */}
            <div className="bg-indigo-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-indigo-700">CampusHub</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Welcome back, Arjun 👋</p>
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-36 bg-gray-50 border-r border-gray-100 p-3 hidden sm:block">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-gray-500 outline-none"
                  />
                </div>
                {[
                  { icon: "🏠", label: "Home", active: true },
                  { icon: "📝", label: "Notes" },
                  { icon: "📚", label: "PYQs" },
                  { icon: "🤖", label: "Ask AI" },
                  { icon: "💬", label: "Discussions" },
                  { icon: "👥", label: "Groups" },
                  { icon: "🔖", label: "Bookmarks" },
                ].map(({ icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer mb-0.5 ${
                      active ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-50"
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                    {label === "Discussions" && (
                      <span className="ml-auto bg-indigo-100 text-indigo-600 text-[9px] px-1 rounded">Live</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-4">
                {/* AI Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">Ask anything to Gemini AI</p>
                    <p className="text-indigo-200 text-xs mt-0.5">Get instant answers to your doubts.</p>
                    <button className="mt-2 bg-white text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                      Ask Now →
                    </button>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🤖</div>
                </div>

                {/* Trending Notes */}
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Trending Notes</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { title: "Data Structures", color: "bg-blue-100 text-blue-600" },
                    { title: "Operating Systems", color: "bg-purple-100 text-purple-600" },
                    { title: "Database System", color: "bg-orange-100 text-orange-600" },
                    { title: "Computer Networks", color: "bg-green-100 text-green-600" },
                  ].map(({ title, color }) => (
                    <div key={title} className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center mb-2 text-sm`}>📄</div>
                      <p className="text-xs font-semibold text-gray-700">{title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">PDF</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}