// import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';

// export default function PostCard({ post }) {
//   return (
//     <div className="card p-0 overflow-hidden">
//       {/* Post Header */}
//       <div className="p-8 border-b border-white/30">
//         <div className="flex items-start space-x-4">
//           <img
//             src={post.author.avatar}
//             alt={post.author.name}
//             className="w-16 h-16 rounded-3xl ring-4 ring-white/30 shadow-2xl"
//           />
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center space-x-3">
//               <h3 className="font-bold text-xl text-gray-900">{post.author.name}</h3>
//               <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg"></span>
//               <span className="text-sm text-gray-500 font-medium">{post.time}</span>
//             </div>
//             <div className="flex items-center space-x-3 mt-2">
//               <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-bold rounded-2xl shadow-lg">
//                 {post.tag}
//               </span>
//               <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-xl cursor-pointer transition-all" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Post Content */}
//       <div className="p-8">
//         <p className="text-xl text-gray-900 leading-relaxed mb-8 font-medium">{post.content}</p>
        
//         {post.image && (
//           <div className="mb-8">
//             <img
//               src={post.image}
//               alt="Post content"
//               className="w-full rounded-3xl shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer"
//             />
//           </div>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="px-8 pb-8 pt-4 flex items-center justify-between border-t border-white/30 bg-gradient-to-b from-white/50 to-transparent">
//         <div className="flex items-center space-x-8">
//           <button className="group flex items-center space-x-2.5 text-gray-700 hover:text-indigo-600 p-3 rounded-2xl hover:bg-indigo-50 transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold">
//             <ThumbsUp className="w-6 h-6 group-hover:scale-110 transition-all" />
//             <span>2.3K</span>
//           </button>
//           <button className="group flex items-center space-x-2.5 text-gray-700 hover:text-blue-600 p-3 rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold">
//             <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-all" />
//             <span>156</span>
//           </button>
//           <button className="group flex items-center space-x-2.5 text-gray-700 hover:text-gray-900 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold">
//             <Share2 className="w-6 h-6 group-hover:scale-110 transition-all" />
//             <span>Share</span>
//           </button>
//         </div>
//         <button className="p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105">
//           <Bookmark className="w-6 h-6" />
//         </button>
//       </div>

//       {/* Top Comment */}
//       <div className="border-t border-white/30">
//         <div className="p-6 bg-gradient-to-b from-gray-50/70 to-white/50 backdrop-blur-sm">
//           <div className="flex items-start space-x-4">
//             <img
//               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
//               alt="Mike Chen"
//               className="w-10 h-10 rounded-2xl ring-2 ring-white/50 mt-1 shadow-lg"
//             />
//             <div className="flex-1">
//               <div className="flex items-center space-x-2 mb-1">
//                 <p className="font-bold text-gray-900 text-base">Mike Chen</p>
//                 <span className="text-sm text-gray-500">· 3h</span>
//               </div>
//               <p className="text-gray-800 font-medium leading-relaxed">
//                 Great question! Sliding window is perfect when you need to maintain a window with certain properties. For "Longest Substring Without Repeating Characters", use a sliding window with a set to track unique chars...
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';

// export default function PostCard({ post }) {
//   return (
//     <div className="card p-0 overflow-hidden">
//       {/* Post Header - Reduced padding */}
//       <div className="p-6 border-b border-white/30">
//         <div className="flex items-start space-x-3">
//           <img
//             src={post.author.avatar}
//             alt={post.author.name}
//             className="w-14 h-14 rounded-2xl ring-4 ring-white/30 shadow-2xl flex-shrink-0"
//           />
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center space-x-2">
//               <h3 className="font-bold text-lg text-gray-900 truncate">{post.author.name}</h3>
//               <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg"></span>
//               <span className="text-xs text-gray-500 font-medium">{post.time}</span>
//             </div>
//             <div className="flex items-center space-x-2 mt-1.5">
//               <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-bold rounded-xl shadow-lg">
//                 {post.tag}
//               </span>
//               <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg cursor-pointer transition-all" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Post Content - Reduced padding & margins */}
//       <div className="p-6">
//         <p className="text-lg text-gray-900 leading-relaxed mb-6 font-medium">{post.content}</p>
        
//         {post.image && (
//           <div className="mb-6">
//             <img
//               src={post.image}
//               alt="Post content"
//               className="w-full rounded-2xl shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer"
//             />
//           </div>
//         )}
//       </div>

//       {/* Actions - Reduced padding & spacing */}
//       <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-white/30 bg-gradient-to-b from-white/50 to-transparent">
//         <div className="flex items-center space-x-6">
//           <button className="group flex items-center space-x-2 text-gray-700 hover:text-indigo-600 p-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:shadow-md hover:scale-105 font-semibold text-sm">
//             <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-all" />
//             <span>2.3K</span>
//           </button>
//           <button className="group flex items-center space-x-2 text-gray-700 hover:text-blue-600 p-2.5 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:shadow-md hover:scale-105 font-semibold text-sm">
//             <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-all" />
//             <span>156</span>
//           </button>
//           <button className="group flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:scale-105 font-semibold text-sm">
//             <Share2 className="w-5 h-5 group-hover:scale-110 transition-all" />
//             <span>Share</span>
//           </button>
//         </div>
//         <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
//           <Bookmark className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Comments Section */}
//       <div className="border-t border-white/30">
//         {/* Top Comment */}
//         <div className="p-5 bg-gradient-to-b from-gray-50/70 to-white/50 backdrop-blur-sm border-b border-white/20">
//           <div className="flex items-start space-x-3">
//             <img
//               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
//               alt="Mike Chen"
//               className="w-9 h-9 rounded-xl ring-2 ring-white/50 mt-0.5 shadow-lg flex-shrink-0"
//             />
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center space-x-1.5 mb-1">
//                 <p className="font-bold text-gray-900 text-sm">Mike Chen</p>
//                 <span className="text-xs text-gray-500">· 3h</span>
//               </div>
//               <p className="text-gray-800 text-sm leading-relaxed">
//                 Great question! Sliding window is perfect when you need to maintain a window with certain properties. For "Longest Substring Without Repeating Characters", use a sliding window with a set to track unique chars...
//               </p>
//               {/* Reply button for top comment */}
//               <button className="mt-2 text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center space-x-1 group">
//                 <span>Reply</span>
//                 <MessageCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Reply Comment - Nested design */}
//         <div className="p-4 pl-11 pr-5 bg-white/80 backdrop-blur-sm border-b border-white/20">
//           <div className="flex items-start space-x-3">
//             <img
//               src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80"
//               alt="Sarah L."
//               className="w-8 h-8 rounded-lg ring-2 ring-white/40 mt-0.5 shadow-md flex-shrink-0"
//             />
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center space-x-1 mb-0.5">
//                 <p className="font-semibold text-gray-900 text-sm">Sarah L.</p>
//                 <span className="text-xs text-gray-500">· 2h</span>
//               </div>
//               <p className="text-gray-800 text-sm leading-relaxed">
//                 @MikeChen Thanks! The set approach makes so much sense. What about handling edge cases like empty strings?
//               </p>
//               {/* Reply actions */}
//               <div className="flex items-center space-x-4 mt-1.5 pt-1.5 border-t border-gray-100">
//                 <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center space-x-1 group">
//                   <span>Reply</span>
//                   <MessageCircle className="w-3 h-3 group-hover:scale-110 transition-transform" />
//                 </button>
//                 <button className="text-xs text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-all">
//                   <ThumbsUp className="w-3.5 h-3.5" />
//                   <span className="sr-only">Like</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Show more replies */}
//         <div className="px-5 py-3 bg-gradient-to-b from-white/60 to-transparent border-b border-white/20">
//           <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center justify-center space-x-1 group w-full">
//             <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
//             <span>View 12 more replies</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal, Play } from 'lucide-react';

export default function PostCard({ post }) {
  // Smart image sizing based on aspect ratio (like LinkedIn)
  const getImageContainerClass = (imageSrc) => {
    // Simulate aspect ratio detection (replace with actual logic)
    const isWideImage = Math.random() > 0.5; // Random for demo
    const isTallImage = Math.random() < 0.3;
    
    if (isWideImage) return "w-full h-full rounded-xl";      // Wide: 192px
    else if (isTallImage) return "w-full h-full rounded-xl"; // Tall: 320px
    else return "w-full h-full rounded-xl";                  // Square: 256px
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-start space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full ring-2 ring-white shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-0.5">
              <h3 className="font-semibold text-gray-900 text-base truncate">{post.author.name}</h3>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-500 font-medium">{post.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg">
                {post.tag}
              </span>
              <MoreHorizontal className="w-4 h-4 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full cursor-pointer transition-all ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-5 py-4">
        <p className="text-gray-900 leading-relaxed text-base mb-4 font-normal line-clamp-3">{post.content}</p>
        
        {post.image && (
          <div className="mb-4 overflow-hidden shadow-sm">
            <div className={getImageContainerClass(post.image)}>
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-full object-cover hover:scale-[1.02] transition-all duration-500 cursor-pointer"
              />
              {post.isVideo && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white p-4 bg-black/50 rounded-full shadow-2xl hover:scale-110 transition-all" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 flex-1">
            <button className="group flex items-center space-x-2 p-2.5 rounded-lg hover:bg-gray-50 transition-all w-full justify-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Like</span>
              <span className="sm:hidden">2.3K</span>
            </button>
            <button className="group flex items-center space-x-2 p-2.5 rounded-lg hover:bg-gray-50 transition-all w-full justify-center text-sm font-medium text-gray-700 hover:text-green-600">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Comment</span>
              <span className="sm:hidden">156</span>
            </button>
            <button className="group flex items-center space-x-2 p-2.5 rounded-lg hover:bg-gray-50 transition-all w-full justify-center text-sm font-medium text-gray-700 hover:text-blue-500">
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform rotate-[-10deg]" />
              <span>Share</span>
            </button>
          </div>
          <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all ml-2">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Top Comment Preview - FIXED */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="px-5 py-4">
          <div className="flex items-start space-x-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              alt="Mike Chen"
              className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-semibold text-gray-900 text-sm">Mike Chen</p>
                <span className="text-xs text-gray-500">· 3h</span>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">
                Great question! Sliding window is perfect when you need to maintain a window with certain properties...
              </p>
              <div className="flex items-center space-x-4 mt-2 pt-2 border-t border-gray-200">
                <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center space-x-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
                <span className="text-xs text-gray-500">12 replies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}