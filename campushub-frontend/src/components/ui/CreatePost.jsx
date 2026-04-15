import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Image, Video, FileText, Send, Sparkles, Loader2, X, User } from 'lucide-react';
import safeStorage from '../../contexts/safeStorage';

export default function CreatePost() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [postType, setPostType] = useState('question'); // question/note/discussion
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api/v1';

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users/current-user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.data.user);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        alert('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    document.getElementById('file-upload').value = '';
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!text.trim() && !file) return;

  //   setIsSubmitting(true);
  //    const token = localStorage.getItem('token');

  //      console.log('🔑 CREATE POST TOKEN:', token ? 'FOUND' : 'MISSING');

  //   try {
  //     const postData = new FormData();
  //     postData.append('content', text);
  //     postData.append('subject', subject);
  //     postData.append('type', postType);
  //     if (file) {
  //       postData.append('file', file);
  //     }

    
  //     const response = await axios.post(`${API_BASE_URL}/posts/create-post`, postData, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         // 'Content-Type': 'multipart/form-data'
  //       }
  //     });

  //     console.log('✅ Post created:', response.data);
  //      alert('Post created successfully! 🎉');
  //   window.location.reload();

  //     // Reset form
  //     setText('');
  //     setSubject('');
  //     setPostType('question');
  //     setFile(null);
  //     setFilePreview(null);
  //     setIsFocused(false);

  //     // Show success & refresh posts
  //     alert('Post created successfully! 🎉');
  //     window.location.reload(); // Refresh to show new post
      
  //   } catch (error) {
  //     console.error('❌ Post error:', error.response?.data);
  //     alert(error.response?.data?.message || 'Failed to create post');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!text.trim() && !file) return;

  setIsSubmitting(true);

  try {
    // ✅ FIXED: Use 'token' (matches login!)
    const token = safeStorage.getItem('token');  // ← 'token' not 'accessToken'
    
    console.log('🔑 CREATE POST TOKEN:', token ? token.slice(0, 20) + '...' : 'MISSING');
    
    if (!token) {
      alert('Please login again');
      navigate('/auth');
      return;
    }

    const postData = new FormData();
    postData.append('content', text);
    postData.append('subject', subject);
    postData.append('type', postType);
    if (file) postData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/posts/create-post`, postData, {
      headers: {
        Authorization: `Bearer ${token}`,  // ✅ Now sends correct token!
      },
    });

    console.log('✅ Post created:', response.data);
    alert('Post created successfully!');
    // window.location.reload();
    
  } catch (error) {
    console.error('Post error:', error.response?.data);
  } finally {
    setIsSubmitting(false);
  }
};

    if (!user) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please log in to create posts
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="group/card relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white/90 to-purple-50/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-500/10 rounded-3xl p-1 mb-10 hover:shadow-3xl hover:shadow-indigo-500/20 transition-all duration-500">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-xl -z-10 group-hover/card:scale-105 transition-all duration-1000" />
      
      <div className="relative z-10">
        {/* Header with REAL USER */}
        <div className="p-8 border-b border-white/40 bg-gradient-to-b from-white/90 to-transparent">
          <div className="flex items-start space-x-5">
            {/* ✅ Real User Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.fullname}
                className="w-16 h-16 rounded-3xl ring-4 ring-white/50 shadow-2xl hover:scale-105 hover:rotate-3 transition-all duration-300 cursor-pointer group-hover/card:ring-indigo-500/30 object-cover"
                onError={(e) => e.target.src = 'https://via.placeholder.com/64?text=👤'}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 border-4 border-white rounded-full shadow-lg ring-2 ring-white/50 animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0 space-y-4">
              {/* Subject Dropdown */}
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent shadow-md hover:shadow-lg transition-all"
              >
                <option value="">📚 Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Programming">Programming</option>
                <option value="Engineering">Engineering</option>
              </select>

              {/* Post Type */}
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent shadow-md hover:shadow-lg transition-all"
              >
                <option value="question">❓ Doubt/Question</option>
                <option value="note">📝 Notes</option>
                <option value="discussion">💬 Discussion</option>
              </select>

              {/* Textarea */}
              <textarea
                placeholder={`✨ Hi ${user.fullname.split(' ')[0]}! What's your doubt today?`}
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isSubmitting}
                className={`
                  w-full p-6 bg-white/70 backdrop-blur-md border-2 border-transparent 
                  rounded-3xl resize-none focus:outline-none focus:border-indigo-400/50 
                  focus:ring-4 focus:ring-indigo-500/20 shadow-xl shadow-white/50
                  text-xl font-medium placeholder-gray-500 text-gray-900
                  transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10
                  ${isFocused ? 'ring-4 ring-indigo-500/30 scale-[1.02]' : 'hover:scale-[1.01]'}
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              />
            </div>
          </div>
        </div>

        {/* File Preview */}
        {filePreview && (
          <div className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-white/40">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200/50 overflow-hidden">
              <img src={filePreview} alt="Preview" className="w-full h-32 object-contain rounded-xl" />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-2xl hover:scale-110 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-sm text-gray-600 mt-2 truncate">{file.name}</p>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="px-8 pb-8 pt-6 flex items-center justify-between bg-gradient-to-t from-white/80 via-white/60 to-transparent backdrop-blur-lg">
          <div className="flex items-center space-x-2">
            <label className="group/btn flex items-center p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-100/80 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-110 backdrop-blur-sm border border-white/50 hover:border-indigo-200 shadow-lg cursor-pointer">
              <Image className="w-6 h-6 group-hover/btn:rotate-12 transition-all" />
              <input
                id="file-upload"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            
            <button className="group/btn flex items-center p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-100/80 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-110 backdrop-blur-sm border border-white/50 hover:border-emerald-200 shadow-lg">
              <Video className="w-6 h-6 group-hover/btn:rotate-12 transition-all" />
            </button>
          </div>

          {/* Post Button */}
          <button 
            type="submit"
            disabled={isSubmitting || !text.trim() && !file}
            className={`
              flex items-center gap-3 px-8 py-4 text-lg font-bold rounded-3xl 
              transition-all duration-300 shadow-2xl hover:shadow-3xl hover:shadow-indigo-500/30
              backdrop-blur-xl border border-transparent hover:border-indigo-300
              ${text.trim() || file
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105 shadow-indigo-500/50 hover:shadow-indigo-500/60 ring-4 ring-indigo-500/20'
                : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed shadow-gray-300/50 ring-2 ring-gray-300/50'
              }
              ${isSubmitting ? 'opacity-75 cursor-not-allowed animate-pulse' : ''}
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 hover:rotate-180 transition-all" />
                <span>Post Doubt ✨</span>
                <Send className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-all" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}