import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users, MessageCircle, Search, Plus, ChevronLeft, X, 
  Hash, Book, Users2, Shield, Calendar ,Menu, ChevronDown
} from 'lucide-react';
import { io } from 'socket.io-client';
import safeStorage from '../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Discussions() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
const [isDesktop, setIsDesktop] = useState(false);
const [showMembers, setShowMembers] = useState(true);
const [showMobileRooms, setShowMobileRooms] = useState(false);
const messageInputRef = useRef(null); // ← ADD THIS
// const socketRef = useRef();

// Add this useEffect for responsive detection
useEffect(() => {
  const checkScreenSize = () => {
    setIsDesktop(window.innerWidth >= 1024);
  };
  
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  return () => window.removeEventListener('resize', checkScreenSize);
}, []);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  const token = safeStorage.getItem('token');
  const userData = safeStorage.getItem('user');
  const userId = userData ? JSON.parse(userData)._id : null;
  const navigate = useNavigate();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;


  // 🔥 Create Room Form State
  const [roomForm, setRoomForm] = useState({
    name: '',
    subject: '',
    description: '',
    isPublic: true
  });

  

  // 🔥 Replace fetchRooms (Line 78)
const fetchRooms = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_BASE_URL}/discussions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // 🔥 POPULATE PARTICIPANTS like PostCard
    const roomsWithUsers = res.data.rooms.map(room => ({
      ...room,
      participants: (room.participants || []).map(p => ({
        _id: p._id,
        fullname: p.fullname || p.username || p.name || 'User',
        username: p.username || p.name || 'User',
        avatar: p.avatar || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤',
        branch: p.branch || '',
        semester: p.semester || ''
      }))
    }));
    
    setRooms(roomsWithUsers);
  } catch (error) {
    toast.error('Failed to load discussions');
  } finally {
    setLoading(false);
  }
}, [token]);


  // 🔥 Create Room
  const createRoom = async (e) => {
    e.preventDefault();
    setCreatingRoom(true);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/discussions`, roomForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Discussion room created! 🎉');
      setRooms(prev => [res.data.room, ...prev]);
      setShowCreateModal(false);
      setRoomForm({ name: '', subject: '', description: '', isPublic: true });
      
      // Auto-join new room
      setSelectedRoom(res.data.room);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room');
    } finally {
      setCreatingRoom(false);
    }
  };



  // 🔥 Replace fetchMessages (Line 108)
     const fetchMessages = useCallback(async (roomId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/discussions/${roomId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('🔥 Raw messages from backend:', res.data.messages?.[0]); // DEBUG
    
    const safeMessages = (res.data.messages || []).map(msg => {
      // 🔥 EXTRACT sender data EXACTLY like PostCard
      const senderData = msg.sender || msg.user || {};
      
      return {
        _id: msg._id,
        content: msg.content || '',
        createdAt: msg.createdAt || new Date().toISOString(),
        sender: {
          _id: senderData._id || msg.senderId || msg.userId,
          fullname: senderData.fullname || senderData.username || senderData.name || 'Anonymous',
          username: senderData.username || senderData.name || 'User',
          avatar: senderData.avatar || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤',
          branch: senderData.branch || '',
          semester: senderData.semester || ''
        }
      };
    }).filter(msg => msg.content);
    
    console.log('🔥 Processed messages:', safeMessages[0]?.sender); // DEBUG
    
    setMessages(safeMessages);
  } catch (error) {
    console.error('Messages error:', error);
    setMessages([]);
    toast.error('Failed to load messages');
  }
}, [token]);
 
const sendMessage = (e) => {
  if (e) e.preventDefault();
  if (!newMessage.trim() || !selectedRoom) return;
  
  const userData = JSON.parse(safeStorage.getItem('user') || '{}');
  
  // 🔥 SEND YOUR FULL USER DATA like PostCard
  socketRef.current?.emit('room-message', {
    roomId: selectedRoom._id,
    content: newMessage.trim(),
    senderId: userId,
    senderName: userData.fullname || userData.username || 'You',
    senderAvatar: userData.avatar
  });
  
  setNewMessage('');
};
  // 🔥 1. Check if joined + auto-join
const isJoined = (room) => {
  return room.participants?.some(p => p._id === userId);
};

// 🔥 2. Join room function
const joinDiscussion = async (roomId) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/discussions/${roomId}/join`, 
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Joined discussion!');
    
    // Update room in list
    setRooms(prev => prev.map(r => 
      r._id === roomId ? res.data.room : r
    ));
    
    // If selected, update selected room
    if (selectedRoom?._id === roomId) {
      setSelectedRoom(res.data.room);
    }
  } catch (error) {
    toast.error('Failed to join room');
  }
};

// 🔥 3. Room click handler
const handleRoomClick = (room) => {
  if (isJoined(room)) {
    setSelectedRoom(room);
  } else {
    joinDiscussion(room._id);
  }
};

  // 🔥 Socket + Effects (same as before)
  useEffect(() => {
    if (!userId || !token) return;

    socketRef.current = io(`${import.meta.env.VITE_API_URL}`, {
      auth: { token }
    });

    // socketRef.current.emit('join-user', userId);
    // Line ~190 - Add username
socketRef.current.emit('join-user', { 
  userId, 
  username: JSON.parse(safeStorage.getItem('user') || '{}').fullname || 'User' 
});

    return () => socketRef.current?.disconnect();
  }, [userId, token]);

  // useEffect(() => {
  //   if (selectedRoom) {
  //     fetchMessages(selectedRoom._id);
      
  //     socketRef.current?.emit('join-room', selectedRoom._id);
      
  //     socketRef.current?.on('new-message', (message) => {
  //       setMessages(prev => [...prev, message]);
  //     });
      
  //     socketRef.current?.on('user-joined', (data) => {
  //       toast.success(`${data.username} joined!`);
  //     });
  //   }
    
  //   return () => {
  //     if (selectedRoom) {
  //       socketRef.current?.emit('leave-room', selectedRoom._id);
  //     }
  //   };
  // }, [selectedRoom]);

  useEffect(() => {
  if (selectedRoom) {
    fetchMessages(selectedRoom._id);
    
    socketRef.current?.emit('join-room', selectedRoom._id);
    
    // 🔥 SAFE SOCKET HANDLER
    const handleNewMessage = (message) => {
      const safeMessage = {
        _id: message._id || `temp-${Date.now()}`,
        content: message.content || '',
        createdAt: message.createdAt || new Date().toISOString(),
        sender: {
          _id: message.senderId || message.sender?._id || userId,
          username: message.senderName || message.sender?.username || 'You'
        }
      };
      setMessages(prev => [...prev, safeMessage]);
    };
    
    // socketRef.current?.on('new-message', handleNewMessage);
    // socketRef.current?.on('user-joined', (data) => {
    //   toast.success(`${data.username || data.name || 'Someone'} joined!`);
    // });
    socketRef.current?.on('new-message', (message) => {
  console.log('🔥 Raw socket message:', message); // DEBUG
  
  // 🔥 BUILD sender EXACTLY like PostCard + backend
  const senderData = {
    _id: message.senderId || message.sender?._id || userId,
    fullname: message.senderName || message.sender?.fullname || message.sender?.username || 'You',
    username: message.senderName || message.sender?.username || 'You',
    avatar: message.sender?.avatar || safeStorage.getItem('user')?.avatar || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤',
    branch: message.sender?.branch || '',
    semester: message.sender?.semester || ''
  };
  
  const safeMessage = {
    _id: message._id || `temp-${Date.now()}-${Math.random()}`,
    content: message.content || '',
    createdAt: message.createdAt || new Date().toISOString(),
    sender: senderData
  };
  
  console.log('🔥 Processed socket message:', safeMessage.sender); // DEBUG
  
  setMessages(prev => [...prev, safeMessage]);
});
  }
  
  return () => {
    socketRef.current?.off('new-message');
    if (selectedRoom) {
      socketRef.current?.emit('leave-room', selectedRoom._id);
    }
  };
}, [selectedRoom, userId]); // Add userId dependency
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 🔥 Header */}
      {/* 🔥 RESPONSIVE HEADER */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8 mb-8 p-4 sm:p-0">
  {/* Left: Back + Title */}
  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
    <button 
      onClick={() => navigate(-1)} 
      className="p-2.5 sm:p-3 hover:bg-white/50 rounded-2xl transition-all shadow-sm hover:shadow-md hover:scale-105 flex-shrink-0"
    >
      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
    
    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl flex items-center justify-center flex-shrink-0">
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Discussions
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-semibold mt-1">
          {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
        </p>
      </div>
    </div>
  </div>
  
  {/* 🔥 MOBILE-FULLWIDTH CREATE BUTTON */}
  <button
    onClick={() => setShowCreateModal(true)}
    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-6 sm:px-8 py-4 sm:py-4 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 border border-white/20 text-base sm:text-lg h-14 sm:h-auto flex-shrink-0 group"
  >
    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
    <span>Create Room</span>
  </button>
</div>
  

        {/* 🔥 MOBILE STACKED + DESKTOP GRID */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 h-screen lg:h-[75vh]">
  
  {/* 🔥 1️⃣ ROOM LIST - Full width mobile */}
  <div className="md:col-span-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden h-80 md:h-full flex flex-col">
    <div className="p-4 sm:p-6 border-b border-white/50 shrink-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-900">Live Rooms</h2>
      </div>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-5 sm:left-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rooms..."
          className="w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 bg-white/50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm focus:border-transparent transition-all"
        />
      </div>
    </div>
    
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 md:space-y-3">
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 h-16 sm:h-20 rounded-xl"></div>
          ))}
        </div>
      ) : filteredRooms.length > 0 ? (
        filteredRooms.slice(0, 5).map(room => (  // 👈 Limit for mobile
          <div
            key={room._id}
            onClick={() => handleRoomClick(room)}
            className={`p-3 sm:p-4 sm:p-5 rounded-xl cursor-pointer transition-all group hover:shadow-lg border hover:border-indigo-300 hover:scale-[1.01] backdrop-blur-sm h-16 sm:h-auto ${
              selectedRoom?._id === room._id
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-300 shadow-indigo-200 ring-2 ring-indigo-500/30'
                : 'bg-white/60 border-gray-200 hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center gap-3 h-full">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0 shadow-lg">
                {room.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-lg text-gray-900 group-hover:text-indigo-700 truncate mb-0.5 sm:mb-1">
                  {room.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{room.subject}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-md sm:px-2 sm:py-1">
                  {room.memberCount}
                </span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No rooms</p>
        </div>
      )}
    </div>
  </div>

  {/* 🔥 2️⃣ CHAT - Full width mobile, center desktop */}
  <div className="md:col-span-1 lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden h-96 md:h-[60vh] lg:h-full flex flex-col">
    {/* Header */}
    <div className="p-4 sm:p-6 border-b border-white/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 shrink-0">
      {selectedRoom ? (
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0 mt-1 sm:mt-0">
            {selectedRoom.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{selectedRoom.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{selectedRoom.subject}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                {selectedRoom.memberCount || 0} online
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">Select Room</h2>
          <p className="text-sm text-gray-600">Choose from left</p>
        </div>
      )}
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 min-h-0">
      {selectedRoom && messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold mb-1 text-gray-900">No messages</h3>
          <p className="text-sm">Start conversation!</p>
        </div>
      ) : selectedRoom ? (
        messages.map((message, index) => {
          const sender = message.sender || {};
          const isOwnMessage = sender._id === userId;
          const senderName = sender.fullname || sender.username || 'Anonymous';

          return (
            <div key={message._id || `msg-${index}`} className={`flex gap-2 ${isOwnMessage ? 'justify-end' : ''}`}>
              {!isOwnMessage && (
                <img 
                  src={sender.avatar} 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-white/50 shadow-md flex-shrink-0 mt-1"
                  alt={senderName}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/32x32/6B7280/FFFFFF?text=👤'}
                />
              )}
              <div className={`max-w-[85%] px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-lg ${isOwnMessage ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm truncate">{senderName}</span>
                  <span className="text-xs opacity-75">{new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          );
        })
      ) : null}
      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    {selectedRoom && (
      <form onSubmit={sendMessage} className="p-3 sm:p-6 border-t border-white/50 bg-white/50 shrink-0">
        <div className="flex items-end gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 px-3 py-2.5 sm:px-5 sm:py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    )}
  </div>

  {/* 🔥 3️⃣ ACTIVE MEMBERS - Full width mobile, right desktop */}
  <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden h-80 lg:h-full flex flex-col">
    <div className="p-4 sm:p-6 border-b border-white/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 shrink-0">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-900">Active Members</h2>
      </div>
      <p className="text-xs sm:text-sm text-gray-600">Live now</p>
    </div>

    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
      {selectedRoom ? (
        selectedRoom.participants?.length > 0 ? (
          selectedRoom.participants.slice(0, 8).map((participant) => {  // 👈 Limit mobile
            const isYou = participant._id === userId;
            return (
              <div key={participant._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group cursor-pointer mb-2 border border-gray-100 hover:border-indigo-200">
                <img 
                  src={participant.avatar} 
                  className="w-10 h-10 rounded-xl ring-2 ring-white/50 shadow-lg flex-shrink-0 object-cover"
                  alt={participant.fullname}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤'}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate group-hover:text-indigo-700">
                    {participant.fullname || participant.username}
                  </p>
                  {participant.branch && (
                    <p className="text-xs text-gray-500 truncate">{participant.branch} • {participant.semester} Sem</p>
                  )}
                </div>
                {isYou && (
                  <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse ml-auto"></div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No members</p>
          </div>
        )
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Users2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Select room</p>
        </div>
      )}
    </div>
  </div>
</div>
      </div>
      

      {/* 🔥 CREATE ROOM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create Discussion
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-2xl transition-all group"
                >
                  <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                </button>
              </div>
              <p className="text-gray-600">Start a new conversation with your classmates</p>
            </div>

            {/* Form */}
            <form onSubmit={createRoom} className="p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Room Name
                </label>
                <input
                  required
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                  placeholder="DSA Doubts & Solutions"
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  maxLength={50}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Subject
                </label>
                <input
                  required
                  value={roomForm.subject}
                  onChange={(e) => setRoomForm({...roomForm, subject: e.target.value})}
                  placeholder="DSA, OS, Java, etc."
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  maxLength={30}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Users2 className="w-4 h-4" />
                  Description (Optional)
                </label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                  placeholder="Help each other with DSA problems, share resources..."
                  rows={3}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm resize-vertical"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {roomForm.description.length}/200
                </p>
              </div>

              {/* Privacy */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                  roomForm.isPublic 
                    ? 'border-indigo-500 bg-indigo-500' 
                    : 'border-gray-300'
                }`}>
                  {roomForm.isPublic && (
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                  )}
                </div>
                <div>
                  <label className="font-bold text-sm text-gray-900 cursor-pointer select-none">
                    Public Room
                  </label>
                  <p className="text-xs text-gray-600">Anyone can join and participate</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingRoom || !roomForm.name || !roomForm.subject}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingRoom ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Room
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );


}