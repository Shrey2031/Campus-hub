import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users, MessageCircle, Search, Plus, ChevronLeft, X, 
  Hash, Book, Users2, Shield, Calendar 
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
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  const token = safeStorage.getItem('token');
  const userData = safeStorage.getItem('user');
  const userId = userData ? JSON.parse(userData)._id : null;
  const navigate = useNavigate();

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
    const res = await axios.get('http://localhost:5000/api/v1/discussions', {
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
      const res = await axios.post('http://localhost:5000/api/v1/discussions', roomForm, {
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
    const res = await axios.get(`http://localhost:5000/api/v1/discussions/${roomId}/messages`, {
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
      `http://localhost:5000/api/v1/discussions/${roomId}/join`, 
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

    socketRef.current = io('http://localhost:5000', {
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-white/50 rounded-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-12 h-12 bg-indigo-500 text-white p-3 rounded-2xl shadow-xl" />
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Discussions
                </h1>
                <p className="text-xl text-gray-600 font-medium">{filteredRooms.length} rooms</p>
              </div>
            </div>
          </div>
          
          {/* 🔥 Create Room Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="group flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 border border-white/20"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Create Room
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[75vh]">
          {/* 🔥 Left: Room List */}
          <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-10 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Live Rooms</h2>
              </div>
              <div className="relative mb-4">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="h-full overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-2xl"></div>
                  ))}
                </div>
              ) : filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
                  <div
                    key={room._id}
                    onClick={() => handleRoomClick(room)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all group hover:shadow-xl border hover:border-indigo-300 hover:scale-[1.02] backdrop-blur-sm ${
                      selectedRoom?._id === room._id
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-300 shadow-indigo-200 ring-2 ring-indigo-500/30 scale-[1.02]'
                        : 'bg-white/60 border-gray-200 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                        {room.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-700 truncate mb-1">
                          {room.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{room.subject}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg">
                            {room.memberCount} members
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-emerald-700 font-medium">Live</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Users className="w-20 h-20 mx-auto mb-6 opacity-30" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900">No Discussions Yet</h3>
                  <p className="mb-6">Be the first to create one!</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 mx-auto bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl"
                  >
                    <Plus className="w-5 h-5" />
                    Create Discussion
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 🔥 Chat Area (same as before) */}
          {/* 🔥 Chat Area */}
<div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col">
  {/* Header */}
  <div className="p-6 border-b border-white/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
    {selectedRoom ? (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {selectedRoom.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 truncate">{selectedRoom.name}</h2>
          <p className="text-sm text-gray-600">{selectedRoom.subject}</p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
              {selectedRoom.memberCount || 0} members online
            </span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">Live</span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <MessageCircle className="w-24 h-24 mx-auto mb-6 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Discussion</h2>
        <p className="text-gray-600">Choose a room from the left to start chatting</p>
      </div>
    )}
  </div>

  {/* Messages */}
    {/* Messages */}
     {/* Messages - EXACTLY LIKE POSTCARD */}
<div className="flex-1 overflow-y-auto p-6 space-y-4">
  {selectedRoom && messages.length === 0 ? (
    <div className="text-center py-20 text-gray-500">
      <MessageCircle className="w-24 h-24 mx-auto mb-6 opacity-30" />
      <h3 className="text-xl font-bold mb-2 text-gray-900">No messages yet</h3>
      <p>Be the first to start the conversation!</p>
    </div>
  ) : selectedRoom ? (
    messages.map((message, index) => {
      const sender = message.sender || {};
      const senderId = sender._id;
      const isOwnMessage = senderId === userId;
      const senderName = sender.fullname || sender.username || 'Anonymous';
      const senderAvatar = sender.avatar;
      const senderBranch = sender.branch;
      const senderSemester = sender.semester;

      return (
        <div key={message._id || `msg-${index}`} className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          {!isOwnMessage && (
            <img 
              src={senderAvatar} 
              className="w-10 h-10 rounded-full ring-2 ring-white/50 shadow-md flex-shrink-0 mt-2"
              alt={senderName}
              onError={(e) => e.target.src = 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤'}
            />
          )}
          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl shadow-lg ${isOwnMessage ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white ml-12' : 'bg-white border border-gray-200 text-gray-900'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-0.5">
                <span className="font-bold text-sm truncate">{senderName}</span>
                {senderBranch && senderSemester && (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                    <span>{senderBranch}</span>
                    <span>• {senderSemester} Sem</span>
                  </div>
                )}
              </div>
              <span className="text-xs opacity-75">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          {isOwnMessage && (
            <img 
              src={safeStorage.getItem('user')?.avatar || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤'}
              className="w-10 h-10 rounded-full ring-2 ring-indigo-500/50 shadow-md flex-shrink-0 mt-2"
              alt="You"
            />
          )}
        </div>
      );
    })
  ) : null}
  <div ref={messagesEndRef} />
</div>

  {/* Input */}
  {selectedRoom && (
    <form onSubmit={sendMessage} className="p-6 border-t border-white/50 bg-white/50">
      <div className="flex items-end gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-5 py-4 border border-gray-200 rounded-3xl focus:ring-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              sendMessage(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  )}
</div>

       {/* 🔥 Right Panel - Active Users */}
<div className="lg:block hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col">
  {/* Header */}
  <div className="p-6 border-b border-white/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-2 h-10 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
      <h2 className="text-xl font-bold text-gray-900">Active Members</h2>
    </div>
    <p className="text-sm text-gray-600">Live in this room</p>
  </div>

  {/* Members List */}
    {/* Members List */}
{/* <div className="flex-1 overflow-y-auto p-4">
  {selectedRoom ? (
    selectedRoom.participants && selectedRoom.participants.length > 0 ? (
      selectedRoom.participants.map((participant) => {
        // 🔥 SAFE ACCESS - Handle missing username/name
        const username = participant.username || participant.name || 'User';
        
        return (
          <div key={participant._id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all group cursor-pointer mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
              {username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-700">
                {username}
              </p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
            {participant._id === userId && (
              <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            )}
          </div>
        );
      })
    ) : (
      <div className="text-center py-12 text-gray-500">
        <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-sm">No members yet</p>
      </div>
    )
  ) : (
    <div className="text-center py-16 text-gray-500">
      <Users2 className="w-20 h-20 mx-auto mb-6 opacity-30" />
      <h3 className="text-lg font-bold mb-2 text-gray-900">Select a Room</h3>
      <p className="text-sm">Choose a discussion to see active members</p>
    </div>
  )}
</div> */}
{/* Members List */}
<div className="flex-1 overflow-y-auto p-4">
  {selectedRoom ? (
    selectedRoom.participants?.length > 0 ? (
      selectedRoom.participants.map((participant) => {
        const isYou = participant._id === userId;
        return (
          <div key={participant._id} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-all group cursor-pointer mb-2 border border-gray-100 hover:border-indigo-200 hover:shadow-md">
            <img 
              src={participant.avatar} 
              className="w-12 h-12 rounded-2xl ring-2 ring-white/50 shadow-lg flex-shrink-0 object-cover"
              alt={participant.fullname}
              onError={(e) => e.target.src = 'https://via.placeholder.com/48x48/6B7280/FFFFFF?text=👤'}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate group-hover:text-indigo-700">
                {participant.fullname || participant.username}
              </p>
              {participant.branch && participant.semester && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  <span>{participant.branch}</span>
                  <span>• {participant.semester} Sem</span>
                </div>
              )}
            </div>
            {isYou && (
              <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse ml-auto"></div>
            )}
          </div>
        );
      })
    ) : (
      <div className="text-center py-12 text-gray-500">
        <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-sm">No members yet</p>
      </div>
    )
  ) : (
    // Empty state
    <div className="text-center py-16 text-gray-500">
      <Users2 className="w-20 h-20 mx-auto mb-6 opacity-30" />
      <h3 className="text-lg font-bold mb-2 text-gray-900">Select a Room</h3>
      <p className="text-sm">Choose a discussion to see active members</p>
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