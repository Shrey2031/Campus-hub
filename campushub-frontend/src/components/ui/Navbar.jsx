// import { Search, Bell, ChevronDown } from 'lucide-react';

// export default function TopNavbar() {
//   return (
//     <div className="bg-white/90 backdrop-blur-2xl border-b border-white/50 px-8 py-5 sticky top-0 z-50 shadow-2xl">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         {/* Search */}
//         <div className="relative w-96">
//           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search doubts, resources, friends..."
//             className="w-full pl-14 pr-5 py-4 bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent shadow-xl transition-all duration-300 placeholder-gray-500"
//           />
//         </div>

//         {/* Right side */}
//         <div className="flex items-center space-x-4">
//           {/* Notifications */}
//           <button className="relative p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105">
//             <Bell className="w-6 h-6" />
//             <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-2xl flex items-center justify-center font-bold shadow-lg">4</span>
//           </button>

//           {/* Profile */}
//           <div className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-2xl transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl hover:scale-105 border border-white/50">
//             <img
//               src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
//               alt="Profile"
//               className="w-12 h-12 rounded-2xl ring-2 ring-white/50 shadow-lg"
//             />
//             <div className="hidden lg:block">
//               <p className="font-semibold text-gray-900 text-base">Sarah Johnson</p>
//               <p className="text-sm text-gray-500 font-medium">CS Junior</p>
//             </div>
//             <ChevronDown className="w-5 h-5 text-gray-500 group-hover:rotate-180 transition-all duration-300" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Search, Bell, ChevronDown } from 'lucide-react';

export default function TopNavbar() {
  return (
    <div className="bg-white/95 backdrop-blur-2xl border-b border-white/60 px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-2xl p-3">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              CampusHub
            </h1>
            <p className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">Student Community</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-80 flex-1 max-w-md mx-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search doubts, resources, friends..."
            className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent shadow-md hover:shadow-lg transition-all duration-300 placeholder-gray-500"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 group">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">4</span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2.5 p-2.5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 cursor-pointer group shadow-md hover:shadow-lg hover:scale-105 border border-white/50">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
              alt="Profile"
              className="w-10 h-10 rounded-2xl ring-2 ring-white/50 shadow-lg"
            />
            <div className="hidden md:block">
              <p className="font-semibold text-gray-900 text-sm">Sarah Johnson</p>
              <p className="text-xs text-gray-500 font-medium">CS Junior</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}