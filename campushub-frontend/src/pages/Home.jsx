import { useState } from 'react'
import Sidebar from '../components/ui/Sidebar'
import TopNavbar from '../components/ui/Navbar'
import CreatePost from '../components/ui/CreatePost'
import PostCard from '../components/ui/PostCard'
import RightSidebar from '../components/ui/RightPanel'

const posts = [
  {
    id: 1,
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80'
    },
    tag: 'DSA',
    time: '2h ago',
    content: "Having trouble understanding the sliding window technique? 🤔\n\nCan someone explain how to identify when to use it vs two pointers? I keep getting stuck on medium LeetCode problems like 'Longest Substring Without Repeating Characters'. Would love a clear example!",
    // image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80'
    image: 'https://imgv2-1-f.scribdassets.com/img/document/727365338/original/dcf5680fd9/1714539930?v=1'
  },
  {
    id: 2,
    author: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80'
    },
    tag: 'System Design',
    time: '4h ago',
    content: "Designing a URL shortener service - what's the most important part to get right first? Database schema or the caching layer? Need advice on scaling to 1M requests/day.",
    image: 'https://i.pinimg.com/originals/6d/e8/20/6de820b07990faa093866070bd441cef.jpg'
  },
  {
    id: 3,
    author: {
      name: 'Rahul Patel',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80'
    },
    tag: 'React',
    time: '6h ago',
    content: "useEffect dependency array confusion 😵\n\nWhen do you include state in deps vs using useCallback/useMemo? Clean patterns for complex state management would help!",
    image: 'https://tse4.mm.bing.net/th/id/OIP.eN-ocwdhdjjjnWhWotffgQHaEK?pid=Api&P=0&h=180'
  },
  {
    id: 4,
    author: {
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80'
    },
    tag: 'OS',
    time: '8h ago',
    content: "Virtual memory vs paging vs segmentation - can someone break down the practical differences? Struggling with OS exam prep.",
    image: null
  }
];

export default  function Home() {
  //   return (
  //   <>
      
  //     <TopNavbar />
    
  //      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-2">
  //       <div className="flex flex-1 max-w-[2560px] mx-auto">
          
          
  //         <Sidebar />
          
        
  //         <div className="flex-1 min-w-0 flex flex-col">
            
  //           <main className="flex-1 flex px-8 py-12 gap-12 max-w-6xl mx-auto w-full">
              
  //             <div className="flex-1 max-w-4xl space-y-8 pr-12">
  //               <CreatePost />
  //               {posts.map((post) => (
  //                 <PostCard key={post.id} post={post} />
  //               ))}
  //             </div>
              
              
  //             <RightSidebar />
          
  //           </main>
  //         </div>
  //       </div>
  //     </div>  




  //   </>
  // )

  return (
  <>
    {/* FIXED NAVBAR - Always at top */}
    <TopNavbar />
    
    {/* FULL SCREEN FLEX - NO SCROLLING HERE */}
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      
      {/* SIDEBAR - FIXED LEFT (h-full + sticky) */}
      <div className="w-72 flex-shrink-0 h-full">
        <Sidebar />
      </div>
      
      {/* CONTENT - ONLY THIS SCROLLS */}
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-[2560px] mx-auto px-8 py-12">
          
          {/* CENTER FEED */}
          <div className="flex gap-12 max-w-6xl mx-auto w-full">
            {/* Posts Column */}
            <div className="flex-1 max-w-4xl space-y-8 pr-12">
              <CreatePost />
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            {/* RIGHT SIDEBAR */}
            <RightSidebar />
          </div>
        </div>
      </div>
      
    </div>
  </>
);
}

