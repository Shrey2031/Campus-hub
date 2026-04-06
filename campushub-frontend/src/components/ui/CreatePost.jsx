// import { Plus, Image, Send } from 'lucide-react';

// export default function CreatePost() {
//   return (
//     <div className="card p-0 shadow-2xl mb-10 overflow-hidden">
//       <div className="p-8 border-b border-white/30">
//         <div className="flex items-start space-x-5">
//           <img
//             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
//             alt="Profile"
//             className="w-16 h-16 rounded-3xl ring-4 ring-white/30 shadow-2xl flex-shrink-0"
//           />
//           <div className="flex-1">
//             <textarea
//               placeholder="What's your doubt today? Share with CampusHub community..."
//               rows={4}
//               className="w-full p-6 bg-white/50 backdrop-blur-sm border-0 rounded-3xl resize-none focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-inner text-xl font-medium placeholder-gray-500 text-gray-900"
//             />
//           </div>
//         </div>
//       </div>
      
//       <div className="px-8 pb-8 pt-6 flex items-center justify-between bg-gradient-to-t from-white/70 to-transparent">
//         <div className="flex items-center space-x-4">
//           <button className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-100 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
//             <Image className="w-6 h-6" />
//           </button>
//           <button className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-100 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md">
//             <Plus className="w-6 h-6" />
//           </button>
//         </div>
//         <button className="btn-primary text-lg px-8">
//           <Send className="w-5 h-5" />
//           Post Doubt
//         </button>
//       </div>
//     </div>
//   );
// }

import { Plus, Image, Video, FileText, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function CreatePost() {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group/card relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white/90 to-purple-50/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-500/10 rounded-3xl p-1 mb-10 hover:shadow-3xl hover:shadow-indigo-500/20 transition-all duration-500">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-xl -z-10 group-hover:scale-105 transition-all duration-1000" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="p-8 border-b border-white/40 bg-gradient-to-b from-white/90 to-transparent">
          <div className="flex items-start space-x-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
                alt="Profile"
                className="w-16 h-16 rounded-3xl ring-4 ring-white/50 shadow-2xl flex-shrink-0 hover:scale-105 hover:rotate-3 transition-all duration-300 cursor-pointer group-hover/parent:ring-indigo-500/30"
              />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 border-4 border-white rounded-full shadow-lg ring-2 ring-white/50 animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0">
              <textarea
                placeholder="✨ What's your doubt today? Share with CampusHub community..."
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                  w-full p-6 bg-white/70 backdrop-blur-md border-2 border-transparent 
                  rounded-3xl resize-none focus:outline-none focus:border-indigo-400/50 
                  focus:ring-4 focus:ring-indigo-500/20 shadow-xl shadow-white/50
                  text-xl font-medium placeholder-gray-500 text-gray-900
                  transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10
                  ${isFocused ? 'ring-4 ring-indigo-500/30 scale-[1.02]' : 'hover:scale-[1.01]'}
                `}
              />
            </div>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="px-8 pb-8 pt-6 flex items-center justify-between bg-gradient-to-t from-white/80 via-white/60 to-transparent backdrop-blur-lg">
          <div className="flex items-center space-x-2">
            {/* Enhanced buttons with tooltips */}
            <button className="group/btn flex items-center p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-100/80 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-110 backdrop-blur-sm border border-white/50 hover:border-indigo-200 shadow-lg hover:shadow-2xl">
              <Image className="w-6 h-6 group-hover/btn:rotate-12 transition-all" />
              <span className="sr-only">Add Image</span>
            </button>
            
            <button className="group/btn flex items-center p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-100/80 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-110 backdrop-blur-sm border border-white/50 hover:border-emerald-200 shadow-lg hover:shadow-2xl">
              <Video className="w-6 h-6 group-hover/btn:rotate-12 transition-all" />
              <span className="sr-only">Add Video</span>
            </button>
            
            <button className="group/btn flex items-center p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-100/80 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-110 backdrop-blur-sm border border-white/50 hover:border-purple-200 shadow-lg hover:shadow-2xl">
              <FileText className="w-6 h-6 group-hover/btn:rotate-12 transition-all" />
              <span className="sr-only">Add Document</span>
            </button>
            
            <button className="group/btn flex items-center p-3 text-gray-600 hover:text-amber-600 hover:bg-amber-100/80 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 hover:scale-110 backdrop-blur-sm border border-white/50 hover:border-amber-200 shadow-lg hover:shadow-2xl">
              <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-all" />
              <span className="sr-only">More</span>
            </button>
          </div>
          
          {/* Enhanced Post Button */}
          <button 
            disabled={!text.trim()}
            className={`
              group/post flex items-center gap-3 px-8 py-4 text-lg font-bold rounded-3xl 
              transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-indigo-500/30
              backdrop-blur-xl border border-transparent hover:border-indigo-300
              ${text.trim() 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105 hover:rotate-[1deg] shadow-indigo-500/50 hover:shadow-indigo-500/60 ring-4 ring-indigo-500/20 hover:ring-indigo-500/30'
                : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed shadow-gray-300/50 ring-2 ring-gray-300/50'
              }
            `}
          >
            <Sparkles className="w-5 h-5 group-hover/post:rotate-180 transition-all duration-300" />
            {text.trim() ? 'Post Doubt ✨' : 'Write something...'}
            <Send className="w-5 h-5 group-hover/post:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}