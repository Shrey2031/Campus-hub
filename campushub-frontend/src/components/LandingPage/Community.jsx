const discussions = [
  { title: "DSA – Doubt Solving", count: "45 online", color: "bg-blue-500" },
  { title: "Database Normalization", count: "32 online", color: "bg-purple-500" },
  { title: "OS – Process Synchronization", count: "28 online", color: "bg-green-500" },
  { title: "CN – Important Questions", count: "19 online", color: "bg-orange-500" },
];

const chatMessages = [
  { user: "Anas", msg: "How does Time Complexity of Merge Sort work?", time: "10:21 AM", isBot: false },
  {
    user: "Bot",
    msg: "It Works in O(n log n) because the array is divided into two halves recursively.",
    time: "10:23 AM",
    isBot: true,
  },
  { user: "Rohan", msg: "Can someone share notes on AVL Tree?", time: "10:25 AM", isBot: false },
];

export default function Community() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1">
          <span className="text-indigo-600 font-semibold text-sm tracking-widest uppercase">
            Learn Together
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
            Real Connections.
            <br />
            Real-time Learning.
          </h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Join live discussions, create study groups, and collaborate with students across the globe.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Real-time chat with Socket.io",
              "Create or join subject-wise groups",
              "Share ideas and solve doubts together",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            Join the Community →
          </button>
        </div>

        {/* Right: Mockup */}
        <div className="flex-1 max-w-xl w-full flex gap-4">
          {/* Discussions list */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-800 text-sm">Active Discussions</p>
              <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">● Live</span>
            </div>
            <div className="space-y-2">
              {discussions.map(({ title, count, color }) => (
                <div key={title} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                    {title[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{title}</p>
                    <p className="text-[10px] text-gray-400">{count}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-indigo-600 text-xs font-semibold w-full text-center hover:underline">
              + View all discussions
            </button>
          </div>

          {/* Chat window */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-800">DSA – Doubt Solving</p>
              <p className="text-[10px] text-green-500">84 online</p>
            </div>
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {chatMessages.map(({ user, msg, time, isBot }, i) => (
                <div key={i} className={`flex gap-2 ${isBot ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${
                      isBot ? "bg-indigo-500" : "bg-pink-400"
                    }`}
                  >
                    {user[0]}
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold ${isBot ? "text-right" : ""} text-gray-500 mb-0.5`}>{user}</p>
                    <div
                      className={`text-xs p-2 rounded-xl leading-relaxed ${
                        isBot
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-gray-100 text-gray-700 rounded-tl-sm"
                      }`}
                    >
                      {msg}
                    </div>
                    <p className="text-[9px] text-gray-400 mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 text-xs bg-transparent outline-none text-gray-600"
                />
                <button className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}