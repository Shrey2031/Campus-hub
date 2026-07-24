import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Image, Video, Send, Sparkles, Loader2, X } from 'lucide-react';
import safeStorage from '../../contexts/safeStorage';

export default function CreatePost() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [postType, setPostType] = useState('question');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

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
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    document.getElementById('file-upload').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setIsSubmitting(true);

    try {
      const token = safeStorage.getItem('token');
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
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Post created:', response.data);
    } catch (error) {
      console.error('Post error:', error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12 text-ink-soft font-body">
        Please log in to create posts
      </div>
    );
  }

  const canSubmit = text.trim() || file;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-sm mb-8">
      <div className="p-6 border-b border-dashed border-ink/15 flex items-start gap-4">
        <img
          src={user.avatar}
          alt={user.fullname}
          className="w-12 h-12 rounded object-cover border border-ink/10 flex-shrink-0"
          onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=%F0%9F%91%A4'}
        />

        <div className="flex-1 min-w-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-3 py-2.5 bg-paper border border-ink/15 rounded font-body text-sm font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="">Select subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Programming">Programming</option>
              <option value="Engineering">Engineering</option>
            </select>

            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="px-3 py-2.5 bg-paper border border-ink/15 rounded font-body text-sm font-medium text-ink focus:outline-none focus:border-ink"
            >
              <option value="question">Doubt / Question</option>
              <option value="note">Notes</option>
              <option value="discussion">Discussion</option>
            </select>
          </div>

          <textarea
            placeholder={`Hi ${user.fullname.split(' ')[0]}! What's your doubt today?`}
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isSubmitting}
            className={`w-full p-4 bg-paper border rounded font-body text-ink placeholder-ink-soft resize-none focus:outline-none transition-colors ${
              isFocused ? 'border-ink' : 'border-ink/15'
            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>

      {filePreview && (
        <div className="px-6 py-4 border-b border-dashed border-ink/15">
          <div className="relative bg-paper border border-ink/10 rounded p-3 inline-block">
            <img src={filePreview} alt="Preview" className="max-h-32 rounded" />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 bg-redpen text-paper p-1.5 rounded-full hover:bg-ink transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="font-mono text-xs text-ink-soft mt-2 truncate max-w-[12rem]">{file.name}</p>
          </div>
        </div>
      )}

      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <label className="flex items-center p-2.5 text-ink-soft hover:text-ink hover:bg-paper rounded transition-colors cursor-pointer">
            <Image className="w-5 h-5" />
            <input
              id="file-upload"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button type="button" className="flex items-center p-2.5 text-ink-soft hover:text-ink hover:bg-paper rounded transition-colors">
            <Video className="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className={`flex items-center gap-2 px-6 py-2.5 rounded font-body font-semibold text-sm transition-colors ${
            canSubmit ? 'bg-ink text-paper hover:bg-redpen' : 'bg-ink/10 text-ink-soft cursor-not-allowed'
          } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Post doubt
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}