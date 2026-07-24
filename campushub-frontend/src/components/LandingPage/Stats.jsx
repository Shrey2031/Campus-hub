const stack = ["REACT", "NODE.JS", "EXPRESS", "MONGODB", "SOCKET.IO", "GEMINI API", "TAILWIND CSS", "JWT AUTH"];

const Stats = () => {
  return (
    <div className="bg-ink border-y-2 border-dashed border-ink/40 py-4 overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-sm text-paper/70 tracking-widest">
        {[...stack, ...stack, ...stack].map((item, i) => (
          <span key={i} className="mx-6 flex items-center gap-6">
            {item}
            <span className="text-highlighter">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Stats;