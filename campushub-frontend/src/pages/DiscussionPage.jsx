import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users, MessageCircle, Search, Plus, ChevronLeft, X,
  Hash, Book, Users2
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
  // Unread is derived by comparing each room's last-activity timestamp
  // (room.lastMessageAt / room.updatedAt, whichever the API sends) against
  // when you last opened that room, stored locally. If neither timestamp
  // field exists on a room, it just won't show a dot rather than guessing.
  const [lastSeenMap, setLastSeenMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('discussionLastSeen') || '{}');
    } catch {
      return {};
    }
  });

  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  const token = safeStorage.getItem('token');
  const userData = safeStorage.getItem('user');
  const userId = userData ? JSON.parse(userData)._id : null;
  const navigate = useNavigate();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  const [roomForm, setRoomForm] = useState({
    name: '',
    subject: '',
    description: '',
    isPublic: true
  });

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/discussions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const roomsWithUsers = res.data.rooms.map(room => ({
        ...room,
        participants: (room.participants || []).map(p => ({
          _id: p._id,
          fullname: p.fullname || p.username || p.name || 'User',
          username: p.username || p.name || 'User',
          avatar: p.avatar || 'https://via.placeholder.com/40x40/16213A/F4F5EF?text=%F0%9F%91%A4',
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

  const createRoom = async (e) => {
    e.preventDefault();
    setCreatingRoom(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/discussions`, roomForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Discussion room created!');
      setRooms(prev => [res.data.room, ...prev]);
      setShowCreateModal(false);
      setRoomForm({ name: '', subject: '', description: '', isPublic: true });
      setSelectedRoom(res.data.room);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room');
    } finally {
      setCreatingRoom(false);
    }
  };

  const fetchMessages = useCallback(async (roomId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/discussions/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const safeMessages = (res.data.messages || []).map(msg => {
        const senderData = msg.sender || msg.user || {};
        return {
          _id: msg._id,
          content: msg.content || '',
          createdAt: msg.createdAt || new Date().toISOString(),
          sender: {
            _id: senderData._id || msg.senderId || msg.userId,
            fullname: senderData.fullname || senderData.username || senderData.name || 'Anonymous',
            username: senderData.username || senderData.name || 'User',
            avatar: senderData.avatar || 'https://via.placeholder.com/40x40/16213A/F4F5EF?text=%F0%9F%91%A4',
            branch: senderData.branch || '',
            semester: senderData.semester || ''
          }
        };
      }).filter(msg => msg.content);

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

    const userDataParsed = JSON.parse(safeStorage.getItem('user') || '{}');

    socketRef.current?.emit('room-message', {
      roomId: selectedRoom._id,
      content: newMessage.trim(),
      senderId: userId,
      senderName: userDataParsed.fullname || userDataParsed.username || 'You',
      senderAvatar: userDataParsed.avatar
    });

    setNewMessage('');
  };

  const isJoined = (room) => room.participants?.some(p => p._id === userId);

  const joinDiscussion = async (roomId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/discussions/${roomId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Joined discussion!');
      setRooms(prev => prev.map(r => r._id === roomId ? res.data.room : r));
      if (selectedRoom?._id === roomId) setSelectedRoom(res.data.room);
    } catch (error) {
      toast.error('Failed to join room');
    }
  };

  const hasUnread = (room) => {
    const lastActivity = room.lastMessageAt || room.updatedAt;
    if (!lastActivity || room._id === selectedRoom?._id) return false;
    const seenAt = lastSeenMap[room._id] || 0;
    return new Date(lastActivity).getTime() > seenAt;
  };

  const markRoomSeen = (roomId) => {
    const updated = { ...lastSeenMap, [roomId]: Date.now() };
    setLastSeenMap(updated);
    localStorage.setItem('discussionLastSeen', JSON.stringify(updated));
  };

  const handleRoomClick = (room) => {
    markRoomSeen(room._id);
    if (isJoined(room)) {
      setSelectedRoom(room);
    } else {
      joinDiscussion(room._id);
    }
  };

  useEffect(() => {
    if (!userId || !token) return;

    socketRef.current = io(`${import.meta.env.VITE_API_URL}`, { auth: { token } });
    socketRef.current.emit('join-user', {
      userId,
      username: JSON.parse(safeStorage.getItem('user') || '{}').fullname || 'User'
    });

    return () => socketRef.current?.disconnect();
  }, [userId, token]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom._id);
      socketRef.current?.emit('join-room', selectedRoom._id);

      socketRef.current?.on('new-message', (message) => {
        const senderData = {
          _id: message.senderId || message.sender?._id || userId,
          fullname: message.senderName || message.sender?.fullname || message.sender?.username || 'You',
          username: message.senderName || message.sender?.username || 'You',
          avatar: message.sender?.avatar || safeStorage.getItem('user')?.avatar || 'https://via.placeholder.com/40x40/16213A/F4F5EF?text=%F0%9F%91%A4',
          branch: message.sender?.branch || '',
          semester: message.sender?.semester || ''
        };

        const safeMessage = {
          _id: message._id || `temp-${Date.now()}-${Math.random()}`,
          content: message.content || '',
          createdAt: message.createdAt || new Date().toISOString(),
          sender: senderData
        };

        setMessages(prev => [...prev, safeMessage]);
      });
    }

    return () => {
      socketRef.current?.off('new-message');
      if (selectedRoom) socketRef.current?.emit('leave-room', selectedRoom._id);
    };
  }, [selectedRoom, userId]);

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
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 pb-8 border-b-2 border-dashed border-ink/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-ink/10 rounded hover:border-ink transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-ink" />
            </button>
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 bg-ink rounded flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-paper" />
              </span>
              <div>
                <h1 className="font-display font-bold text-ink text-3xl">Discussions</h1>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mt-0.5">
                  {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-ink text-paper font-body font-semibold px-6 py-3 rounded hover:bg-redpen transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-screen lg:h-[75vh]">

          {/* Room list */}
          <div className="md:col-span-1 bg-white border border-ink/10 rounded-sm overflow-hidden h-80 md:h-full flex flex-col">
            <div className="p-5 border-b border-dashed border-ink/15 shrink-0">
              <h2 className="font-display font-bold text-ink mb-3">Live rooms</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full pl-9 pr-3 py-2.5 bg-paper border border-ink/15 rounded font-body text-sm focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-ink/5 h-16 rounded-sm" />)}
                </div>
              ) : filteredRooms.length > 0 ? (
                filteredRooms.slice(0, 8).map(room => (
                  <div
                    key={room._id}
                    onClick={() => handleRoomClick(room)}
                    className={`p-3 rounded-sm cursor-pointer transition-colors border ${
                      selectedRoom?._id === room._id
                        ? 'bg-highlighter/10 border-highlighter/40'
                        : 'bg-paper border-transparent hover:border-ink/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative w-10 h-10 bg-ink rounded flex items-center justify-center text-paper font-display font-bold flex-shrink-0">
                        {room.name[0]?.toUpperCase()}
                        {hasUnread(room) && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-redpen rounded-full border-2 border-paper" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-body font-semibold text-sm text-ink truncate">{room.name}</h3>
                        <p className="font-mono text-[10px] text-ink-soft truncate">{room.subject}</p>
                      </div>
                      <span className="font-mono text-[10px] text-ink-soft flex-shrink-0">{room.memberCount}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-ink-soft">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-body">No rooms</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="md:col-span-1 lg:col-span-2 bg-white border border-ink/10 rounded-sm overflow-hidden h-96 md:h-[60vh] lg:h-full flex flex-col">
            <div className="p-5 border-b border-dashed border-ink/15 shrink-0">
              {selectedRoom ? (
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-ink rounded flex items-center justify-center text-paper font-display font-bold flex-shrink-0">
                    {selectedRoom.name[0]?.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-ink truncate">{selectedRoom.name}</h2>
                    <p className="font-mono text-[10px] text-ink-soft truncate">{selectedRoom.subject}</p>
                  </div>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-redpen flex items-center gap-1 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-redpen" /> {selectedRoom.memberCount || 0} online
                  </span>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 text-ink/20" />
                  <h2 className="font-display font-bold text-ink">Select a room</h2>
                  <p className="font-body text-ink-soft text-sm">Choose from the list</p>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {selectedRoom && messages.length === 0 ? (
                <div className="text-center py-12 text-ink-soft">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <h3 className="font-display font-bold text-ink">No messages</h3>
                  <p className="font-body text-sm">Start the conversation.</p>
                </div>
              ) : selectedRoom ? (
                messages.map((message, index) => {
                  const sender = message.sender || {};
                  const isOwnMessage = sender._id === userId;
                  const senderName = sender.fullname || sender.username || 'Anonymous';

                  const prev = messages[index - 1];
                  const isGrouped = prev &&
                    (prev.sender?._id || prev.sender?.username) === (sender._id || sender.username) &&
                    (new Date(message.createdAt) - new Date(prev.createdAt)) < 3 * 60 * 1000;

                  return (
                    <div
                      key={message._id || `msg-${index}`}
                      className={`flex gap-2 ${isOwnMessage ? 'justify-end' : ''} ${isGrouped ? 'mt-1' : 'mt-3'}`}
                    >
                      {!isOwnMessage && (
                        isGrouped ? (
                          <span className="w-8 flex-shrink-0" />
                        ) : (
                          <img
                            src={sender.avatar}
                            className="w-8 h-8 rounded object-cover border border-ink/10 flex-shrink-0 mt-1"
                            alt={senderName}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/32x32/16213A/F4F5EF?text=%F0%9F%91%A4'}
                          />
                        )
                      )}
                      <div className={`max-w-[80%] px-3.5 py-2.5 rounded-sm ${
                        isOwnMessage ? 'bg-ink text-paper' : 'bg-paper border border-ink/10 text-ink'
                      }`}>
                        {!isGrouped && (
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span className="font-body font-semibold text-xs truncate">{senderName}</span>
                            <span className="font-mono text-[10px] opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                        <p className="font-body text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            {selectedRoom && (
              <form onSubmit={sendMessage} className="p-4 border-t border-dashed border-ink/15 shrink-0">
                <div className="flex items-end gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 px-4 py-3 bg-paper border border-ink/15 rounded font-body text-sm focus:outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-11 h-11 bg-ink text-paper rounded hover:bg-redpen transition-colors flex items-center justify-center disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Active members */}
          <div className="lg:col-span-1 bg-white border border-ink/10 rounded-sm overflow-hidden h-80 lg:h-full flex flex-col">
            <div className="p-5 border-b border-dashed border-ink/15 shrink-0">
              <h2 className="font-display font-bold text-ink">Active members</h2>
              <p className="font-mono text-[10px] uppercase tracking-wide text-redpen mt-0.5">Live now</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {selectedRoom ? (
                selectedRoom.participants?.length > 0 ? (
                  selectedRoom.participants.slice(0, 8).map((participant) => {
                    const isYou = participant._id === userId;
                    return (
                      <div key={participant._id} className="flex items-center gap-3 p-2.5 rounded hover:bg-paper transition-colors mb-1">
                        <img
                          src={participant.avatar}
                          className="w-9 h-9 rounded object-cover border border-ink/10 flex-shrink-0"
                          alt={participant.fullname}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/36x36/16213A/F4F5EF?text=%F0%9F%91%A4'}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-sm text-ink truncate">
                            {participant.fullname || participant.username}
                          </p>
                          {participant.branch && (
                            <p className="font-mono text-[10px] text-ink-soft truncate">
                              {participant.branch} · Sem {participant.semester}
                            </p>
                          )}
                        </div>
                        {isYou && <span className="w-2 h-2 bg-highlighter rounded-full flex-shrink-0" />}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-ink-soft">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-body">No members</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-ink-soft">
                  <Users2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-body">Select a room</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create room modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-2xl border border-ink/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dashed border-ink/15 sticky top-0 bg-white flex items-center justify-between">
              <h2 className="font-display font-bold text-ink text-xl">Create discussion</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-paper rounded transition-colors">
                <X className="w-5 h-5 text-ink-soft" />
              </button>
            </div>

            <form onSubmit={createRoom} className="p-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
                  <Hash className="w-3.5 h-3.5" /> Room name
                </label>
                <input
                  required
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  placeholder="DSA Doubts & Solutions"
                  maxLength={50}
                  className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
                  <Book className="w-3.5 h-3.5" /> Subject
                </label>
                <input
                  required
                  value={roomForm.subject}
                  onChange={(e) => setRoomForm({ ...roomForm, subject: e.target.value })}
                  placeholder="DSA, OS, Java, etc."
                  maxLength={30}
                  className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
                  <Users2 className="w-3.5 h-3.5" /> Description (optional)
                </label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  placeholder="Help each other with DSA problems, share resources..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body resize-vertical focus:outline-none focus:border-ink"
                />
                <p className="font-mono text-[10px] text-ink-soft mt-1">{roomForm.description.length}/200</p>
              </div>

              <label className="flex items-center gap-3 p-3.5 bg-paper rounded-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={roomForm.isPublic}
                  onChange={(e) => setRoomForm({ ...roomForm, isPublic: e.target.checked })}
                  className="w-4 h-4 accent-ink"
                />
                <div>
                  <p className="font-body font-semibold text-sm text-ink">Public room</p>
                  <p className="font-body text-xs text-ink-soft">Anyone can join and participate</p>
                </div>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-ink/15 text-ink font-body font-semibold rounded hover:bg-paper transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingRoom || !roomForm.name || !roomForm.subject}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-ink text-paper font-body font-semibold rounded hover:bg-redpen transition-colors disabled:opacity-40"
                >
                  {creatingRoom ? (
                    <>
                      <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create room
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