const testimonials = [
  {
    quote:
      "CampusHub helped me score high by providing the best notes and PYQs. The AI help is just amazing!",
    name: "Priya Sharma",
    role: "CSE, 2nd Year",
    color: "bg-pink-400",
  },
  {
    quote:
      "Finally, a platform where students actually help students. The discussions and groups are super helpful!",
    name: "Rohit Kumar",
    role: "IT, 3rd Year",
    color: "bg-blue-400",
  },
  {
    quote:
      "Gemini AI answers my doubts in seconds. It's like having a personal tutor 24/7.",
    name: "Neha Patel",
    role: "ECE, 2nd Year",
    color: "bg-green-400",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-yellow-400 text-sm">
      {[...Array(5)].map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-indigo-600 text-sm font-semibold tracking-widest uppercase">
            Loved by learners
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
            What students say about CampusHub
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ quote, name, role, color }) => (
            <div
              key={name}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-5xl text-indigo-100 font-serif leading-none mb-3 select-none">"</div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">{quote}</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
              <div className="mt-3">
                <Stars />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}