// import { Home, BookOpen, MessageCircle, Upload, User, Settings, LogOut } from 'lucide-react';

// const menuItems = [
//   { icon: Home, label: 'Feed', href: '#feed', active: true },
//   { icon: BookOpen, label: 'Resources', href: '#resources', active: false },
//   { icon: MessageCircle, label: 'Discussions', href: '#discussions', active: false },
//   { icon: Upload, label: 'Upload', href: '#upload', active: false },
//   { icon: User, label: 'Profile', href: '#profile', active: false },
//   { icon: Settings, label: 'Settings', href: '#settings', active: false },
// ];

// export default function Sidebar() {
//   return (
//     <div className="w-72 bg-white/90 backdrop-blur-2xl border-r border-white/50 h-screen sticky top-0 shadow-2xl">
//       <div className="p-8">
//         <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-12">
//           Campus<span className="text-indigo-600">Hub</span>
//         </div>
        
//         <nav className="space-y-3">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <a
//                 key={item.href}
//                 href={item.href}
//                 className={`group flex items-center p-4 rounded-2xl transition-all duration-300 font-semibold ${
//                   item.active
//                     ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/25 scale-[1.02]'
//                     : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-indigo-200'
//                 }`}
//               >
//                 <Icon className={`w-6 h-6 mr-4 group-hover:scale-110 transition-all ${item.active ? 'drop-shadow-lg' : ''}`} />
//                 <span>{item.label}</span>
//               </a>
//             );
//           })}
          
//           <a href="#logout" className="group flex items-center p-4 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold border border-transparent hover:border-red-200 mt-6">
//             <LogOut className="w-6 h-6 mr-4 group-hover:scale-110 transition-all" />
//             <span>Logout</span>
//           </a>
//         </nav>
//       </div>
//     </div>
//   );
// }

import { Home, BookOpen, MessageCircle, Upload, User, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Feed', href: '#feed', active: true },
  { icon: BookOpen, label: 'Resources', href: '#resources', active: false },
  { icon: MessageCircle, label: 'Discussions', href: '#discussions', active: false },
  { icon: Upload, label: 'Upload', href: '#upload', active: false },
  { icon: User, label: 'Profile', href: '#profile', active: false },
  { icon: Settings, label: 'Settings', href: '#settings', active: false },
];

export default function Sidebar() {
  return (
    <div className="w-72 bg-white/90 backdrop-blur-2xl border-r border-white/50 h-screen sticky top-0 shadow-2xl">
      <div className="p-8">
        {/* Just a subtle indicator now */}
        {/* <div className="h-16 mb-12 flex items-center justify-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl shadow-lg border border-indigo-200/50">
          <span className="text-indigo-600 font-bold text-lg tracking-wider uppercase">CH</span>
        </div> */}
        
        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center p-4 rounded-2xl transition-all duration-300 font-semibold ${
                  item.active
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/25 scale-[1.02]'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-indigo-200'
                }`}
              >
                <Icon className={`w-6 h-6 mr-4 group-hover:scale-110 transition-all ${item.active ? 'drop-shadow-lg' : ''}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
          
          <a href="#logout" className="group flex items-center p-4 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold border border-transparent hover:border-red-200 mt-6">
            <LogOut className="w-6 h-6 mr-4 group-hover:scale-110 transition-all" />
            <span>Logout</span>
          </a>
        </nav>
      </div>
    </div>
  );
}

