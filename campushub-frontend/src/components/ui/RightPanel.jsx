

// import { Bell, TrendingUp, Users, Eye, BookOpen, Download } from 'lucide-react';

// const notifications = [
//   { type: 'comment', text: 'John commented on your post "Sliding Window"', time: '2m ago', color: 'blue' },
//   { type: 'like', text: 'Sarah liked your post "URL Shortener Design"', time: '5m ago', color: 'pink' },
//   { type: 'follow', text: 'Mike started following you', time: '1h ago', color: 'green' },
// ];

// const trending = ['DSA', 'System Design', 'React Hooks'];

// const activeUsers = [
//   {
//     name: 'Sarah Johnson',
//     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80',
//     status: 'online',
//     role: 'CS Junior'
//   },
//   {
//     name: 'Mike Chen',
//     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80',
//     status: 'online',
//     role: 'Senior Dev'
//   },
//   {
//     name: 'Priya Sharma',
//     avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80',
//     status: 'away',
//     role: 'Data Scientist'
//   },
// ];

// const resources = [
//   {
//     title: 'DBMS Notes - Complete',
//     author: 'Rahul Patel',
//     type: 'PDF',
//     views: '1.2K',
//     icon: '📚'
//   },
//   {
//     title: 'OS Important Questions',
//     author: 'Priya Sharma',
//     type: 'PDF',
//     views: '892',
//     icon: '💾'
//   },
//   {
//     title: 'DSA Cheatsheet 2024',
//     author: 'Mike Chen',
//     type: 'PDF',
//     views: '2.5K',
//     icon: '⚡'
//   },
// ];

// export default function RightSidebar() {
//   return (
//     <div className="w-80 space-y-6 pr-2">
//       {/* 1. Notifications */}
//       <div className="card p-6 shadow-2xl h-80 flex flex-col">
//         <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/30 flex-shrink-0">
//           <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
//             <Bell className="w-5 h-5 text-indigo-600 shadow-lg p-1 bg-indigo-100 rounded-lg" />
//             Notifications
//           </h3>
//           <span className="text-indigo-600 font-semibold text-xs bg-indigo-100 px-2.5 py-1 rounded-lg shadow-sm hover:bg-indigo-200 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1">
//             Mark all
//           </span>
//         </div>
        
//         <div className="space-y-3 mb-6 flex-shrink-0">
//           {notifications.map((notif, i) => (
//             <div key={i} className="flex items-start space-x-3 p-3 -m-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md">
//               <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-r from-${notif.color}-500 to-${notif.color}-600 shadow-md`} />
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors line-clamp-1">{notif.text}</p>
//                 <p className="text-xs text-gray-500 font-medium mt-0.5">{notif.time}</p>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <div className="flex-1 flex items-end pt-2 border-t border-white/30">
//           <a href="#" className="group flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md w-full justify-center">
//             <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             View All Notifications
//           </a>
//         </div>
//       </div>

//       {/* 2. Trending Topics */}
//       <div className="card p-6 shadow-2xl h-85 flex flex-col">
//         <div className="flex items-center mb-4 pb-3 border-b border-white/30 flex-shrink-0">
//           <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2.5 flex-1">
//             <TrendingUp className="w-5 h-5 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent shadow-lg p-1 bg-orange-100/50 rounded-lg" />
//             Trending Topics
//           </h3>
//         </div>
        
//         <div className="space-y-2 mb-6 flex-shrink-0">
//           {trending.map((topic, i) => (
//             <a key={i} href="#" className="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:text-white transition-all duration-300 font-semibold shadow-sm hover:shadow-md hover:scale-105 group border border-transparent hover:border-white/50">
//               <span className="text-sm group-hover:translate-x-1.5 transition-transform">#{topic}</span>
//             </a>
//           ))}
//         </div>
        
//         <div className="flex-1 flex items-end pt-1 border-t border-white/30">
//           <a href="#" className="group flex items-center gap-2 text-orange-600 font-semibold text-sm hover:text-orange-700 hover:bg-orange-50 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md w-full justify-center">
//             <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             View All Topics
//           </a>
//         </div>
//       </div>

//       {/* 3. Active Users */}
//       <div className="card p-6 shadow-2xl h-80 flex flex-col">
//         <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/30 flex-shrink-0">
//           <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
//             <Users className="w-5 h-5 text-emerald-600 shadow-lg p-1 bg-emerald-100 rounded-lg" />
//             Active Users
//           </h3>
//           <span className="text-emerald-600 font-semibold text-xs bg-emerald-100 px-2.5 py-1 rounded-lg shadow-sm hover:bg-emerald-200 transition-colors cursor-pointer whitespace-nowrap">Live</span>
//         </div>
        
//         <div className="space-y-3 mb-6 flex-shrink-0">
//           {activeUsers.slice(0, 3).map((user, i) => (
//             <a key={i} href="#" className="group flex items-center space-x-3 p-3 -m-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-105">
//               <div className="relative flex-shrink-0">
//                 <img
//                   src={user.avatar}
//                   alt={user.name}
//                   className="w-10 h-10 rounded-xl ring-2 ring-white/50 shadow-lg"
//                 />
//                 <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold ${user.status === 'online' ? 'bg-emerald-500 text-white' : 'bg-orange-400 text-white'}`}>
//                   ●
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors truncate">{user.name}</p>
//                 <p className="text-xs text-gray-500 font-medium">{user.role}</p>
//               </div>
//             </a>
//           ))}
//         </div>
        
//         <div className="flex-1 flex items-end pt-2 border-t border-white/30">
//           <a href="#" className="group flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md w-full justify-center">
//             <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             View All Active Users
//           </a>
//         </div>
//       </div>

//       {/* 4. NEW Resources Card */}
//       <div className="card p-6 shadow-2xl h-100 flex flex-col">
//         <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/30 flex-shrink-0">
//           <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
//             <BookOpen className="w-5 h-5 text-amber-600 shadow-lg p-1 bg-amber-100 rounded-lg" />
//             Top Resources
//           </h3>
//           <span className="text-amber-600 font-semibold text-xs bg-amber-100 px-2.5 py-1 rounded-lg shadow-sm hover:bg-amber-200 transition-colors cursor-pointer whitespace-nowrap">New</span>
//         </div>
        
//         <div className="space-y-3 mb-6 flex-shrink-0">
//           {resources.map((resource, i) => (
//             <a key={i} href="#" className="group flex items-start space-x-3 p-3 -m-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 border border-transparent hover:border-amber-200">
//               <div className="w-2 h-10 flex items-center justify-center text-2xl font-bold text-amber-500 bg-amber-100 rounded-lg p-2 flex-shrink-0">
//                 {resource.icon}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-gray-900 text-sm group-hover:text-amber-700 transition-colors line-clamp-1">{resource.title}</p>
//                 <p className="text-xs text-gray-500 font-medium mt-0.5">by {resource.author}</p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-gray-600 font-medium">{resource.type}</span>
//                   <span className="text-xs text-gray-500 flex items-center gap-1">
//                     👁️ {resource.views}
//                   </span>
//                 </div>
//               </div>
//               <Download className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:scale-110 transition-all flex-shrink-0" />
//             </a>
//           ))}
//         </div>
        
//         <div className="flex-1 flex items-end pt-2 border-t border-white/30">
//           <a href="#" className="group flex items-center gap-2 text-amber-600 font-semibold text-sm hover:text-amber-700 hover:bg-amber-50 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md w-full justify-center">
//             <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             View All Resources
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Bell, TrendingUp, Users, Eye, BookOpen, Download } from 'lucide-react';

const notifications = [
  { type: 'comment', text: 'John commented on your post "Sliding Window"', time: '2m ago', color: 'blue' },
  { type: 'like', text: 'Sarah liked your post "URL Shortener Design"', time: '5m ago', color: 'pink' },
  { type: 'follow', text: 'Mike started following you', time: '1h ago', color: 'green' },
];

const trending = ['DSA', 'System Design', 'React Hooks'];

const activeUsers = [
  {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80',
    status: 'online',
    role: 'CS Junior'
  },
  {
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80',
    status: 'online',
    role: 'Senior Dev'
  },
  {
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80',
    status: 'away',
    role: 'Data Scientist'
  },
];

const resources = [
  {
    title: 'DBMS Notes - Complete',
    author: 'Rahul Patel',
    type: 'PDF',
    views: '1.2K',
    icon: '📚'
  },
  {
    title: 'OS Important Questions',
    author: 'Priya Sharma',
    type: 'PDF',
    views: '892',
    icon: '💾'
  },
  {
    title: 'DSA Cheatsheet 2024',
    author: 'Mike Chen',
    type: 'PDF',
    views: '2.5K',
    icon: '⚡'
  },
];

export default function RightSidebar() {
  return (
    <div className="w-80 xl:w-96 space-y-5 pr-4 sticky top-20 self-start">
      {/* 1. Notifications - Fixed Height */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-80 flex flex-col hover:shadow-2xl transition-all duration-300">
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-0">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="w-4 h-4 text-white" />
              </div>
              Notifications
            </h3>
            <button className="text-indigo-600 text-xs font-semibold bg-indigo-50 px-3 py-1.5 rounded-xl shadow-sm hover:bg-indigo-100 transition-all whitespace-nowrap">
              Mark all
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {notifications.map((notif, i) => (
            <div key={i} className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-indigo-50/50 transition-all cursor-pointer border border-transparent hover:border-indigo-200">
              <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r from-${notif.color}-500 to-${notif.color}-600 shadow-sm`} />
              <div className="flex-1 min-w-0 py-1">
                <p className="font-semibold text-sm text-gray-900 group-hover:text-indigo-700 line-clamp-1">{notif.text}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 pt-0 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 text-indigo-600 font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md">
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
      </div>

      {/* 2. Trending Topics - Fixed Height */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-72 flex flex-col hover:shadow-2xl transition-all duration-300">
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Trending
          </h3>
        </div>
        
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          {trending.map((topic, i) => (
            <button key={i} className="w-full group flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all border hover:border-orange-200 shadow-sm hover:shadow-md">
              <span className="font-semibold text-sm text-gray-900 group-hover:text-orange-700 truncate">#{topic}</span>
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-all">
                <span className="text-xs font-bold text-orange-600">+{i + 10}K</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Active Users - Fixed Height */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-80 flex flex-col hover:shadow-2xl transition-all duration-300">
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              Active Users
            </h3>
            <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl shadow-sm">● Live</span>
          </div>
        </div>
        
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {activeUsers.slice(0, 3).map((user, i) => (
            <button key={i} className="w-full group flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50/50 transition-all cursor-pointer border hover:border-emerald-200 shadow-sm hover:shadow-md">
              <div className="relative flex-shrink-0">
                <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-2xl ring-2 ring-white shadow-lg" />
                <span className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold shadow-md ${user.status === 'online' ? 'bg-emerald-500 text-white' : 'bg-orange-400 text-white'}`}>
                  ●
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-700 truncate">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-4 pt-0 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 text-emerald-600 font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md">
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
      </div>

      {/* 4. Top Resources - Fixed Height */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-[28rem] flex flex-col hover:shadow-2xl transition-all duration-300">
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              Top Resources
            </h3>
            <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-3 py-1.5 rounded-xl shadow-sm">● New</span>
          </div>
        </div>
        
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {resources.map((resource, i) => (
            <button key={i} className="w-full group flex items-start space-x-3 p-4 rounded-xl hover:bg-amber-50/50 transition-all cursor-pointer border hover:border-amber-200 shadow-sm hover:shadow-md h-20">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl">{resource.icon}</span>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="font-semibold text-sm text-gray-900 group-hover:text-amber-700 line-clamp-1">{resource.title}</p>
                <p className="text-xs text-gray-500 mt-1">by {resource.author}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs bg-white px-2 py-1 rounded-lg text-gray-600 font-medium shadow-sm">{resource.type}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {resource.views}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-4 pt-0 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 text-amber-600 font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-amber-50 transition-all shadow-sm hover:shadow-md">
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
      </div>
    </div>
  );
}