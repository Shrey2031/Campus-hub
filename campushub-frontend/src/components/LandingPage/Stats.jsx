const stats = [
  { icon: "👤", value: "50K+", label: "Active Students" },
  { icon: "📄", value: "10K+", label: "Notes & Resources" },
  { icon: "📚", value: "25K+", label: "PYQs Available" },
  { icon: "👥", value: "100+", label: "Active Groups" },
  { icon: "💬", value: "Real-time", label: "Discussions" },
];

export default function Stats() {
  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map(({ icon, value, label }) => (
            <div key={label} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">
                {icon}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg font-extrabold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}