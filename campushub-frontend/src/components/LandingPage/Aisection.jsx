export default function AISection() {
  return (
    <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 py-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        {/* Left */}
        <div className="flex-1 text-white">
          <p className="text-indigo-300 font-semibold text-sm mb-2 flex items-center gap-2">
            <span className="text-yellow-400">✦</span> Powered by
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Gemini AI
          </h2>
          <p className="text-indigo-200 text-lg max-w-md mb-8 leading-relaxed">
            Stuck on a tough concept? Just ask! Gemini AI is here to help you understand better, faster.
          </p>
          <button className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg">
            Ask Gemini AI Now →
          </button>
        </div>

        {/* Right: Chat UI mockup */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 p-5">
            {/* User message */}
            <div className="flex justify-end mb-4">
              <div className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs">
                Explain binary search tree with example.
              </div>
            </div>

            {/* AI response */}
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">🤖</div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm p-4 flex-1">
                <p className="text-sm text-gray-700 mb-3">
                  A Binary Search Tree (BST) is a node-based binary tree data structure where each node has at most two children, called left and right...
                </p>
                {/* Tree SVG */}
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <svg viewBox="0 0 200 130" className="w-full h-28">
                    {/* Lines */}
                    <line x1="100" y1="20" x2="60" y2="55" stroke="#6366f1" strokeWidth="1.5" />
                    <line x1="100" y1="20" x2="140" y2="55" stroke="#6366f1" strokeWidth="1.5" />
                    <line x1="60" y1="55" x2="35" y2="90" stroke="#6366f1" strokeWidth="1.5" />
                    <line x1="60" y1="55" x2="80" y2="90" stroke="#6366f1" strokeWidth="1.5" />
                    <line x1="140" y1="55" x2="160" y2="90" stroke="#6366f1" strokeWidth="1.5" />

                    {/* Nodes */}
                    {[
                      { cx: 100, cy: 18, label: "8" },
                      { cx: 60, cy: 55, label: "3" },
                      { cx: 140, cy: 55, label: "10" },
                      { cx: 35, cy: 90, label: "1" },
                      { cx: 80, cy: 90, label: "6" },
                      { cx: 160, cy: 90, label: "14" },
                    ].map(({ cx, cy, label }) => (
                      <g key={label}>
                        <circle cx={cx} cy={cy} r="13" fill="#6366f1" />
                        <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                          {label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* User reply */}
            <div className="flex justify-end items-end gap-2">
              <div className="bg-indigo-50 text-gray-700 text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs">
                That makes sense! Thanks 😊
              </div>
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}