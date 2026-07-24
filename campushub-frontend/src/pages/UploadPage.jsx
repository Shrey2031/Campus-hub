import { useState, useMemo, useRef } from 'react';
import { Book, Play, X, ChevronLeft, MessageCircle } from 'lucide-react';
import safeStorage from '../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    content: '',
    subject: '',
    type: 'question',
    file: null
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(safeStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const token = safeStorage.getItem('token');

  const handleUploadPost = async () => {
    if (!uploadForm.content.trim()) {
      toast.error('Please add some content');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('content', uploadForm.content);
    formData.append('subject', uploadForm.subject);
    formData.append('type', uploadForm.type);
    if (uploadForm.file) formData.append('file', uploadForm.file);

    try {
      await axios.post(`${API_BASE_URL}/posts/create-post`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Post uploaded successfully!');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadForm({ ...uploadForm, file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadForm({ ...uploadForm, file: e.dataTransfer.files[0] });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-dashed border-ink/20">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-ink/10 rounded hover:border-ink transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <div>
            <h1 className="font-display font-bold text-ink text-3xl">Create post</h1>
            <p className="font-body text-ink-soft text-sm mt-0.5">Share with your campus</p>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-sm overflow-hidden">

          {/* User header */}
          <div className="p-6 border-b border-dashed border-ink/15 flex items-center gap-4">
            <img
              src={currentUser.avatar || 'https://via.placeholder.com/56x56/16213A/F4F5EF?text=%F0%9F%91%A4'}
              alt={currentUser.fullname}
              className="w-12 h-12 rounded object-cover border border-ink/10 flex-shrink-0"
              onError={(e) => e.target.src = 'https://via.placeholder.com/56x56/16213A/F4F5EF?text=%F0%9F%91%A4'}
            />
            <div className="min-w-0">
              <h2 className="font-body font-semibold text-ink truncate">
                {currentUser.fullname || currentUser.username || 'User'}
              </h2>
              {(currentUser.branch || currentUser.semester) && (
                <p className="font-mono text-[10px] text-ink-soft mt-0.5">
                  {currentUser.branch} {currentUser.semester && `· Sem ${currentUser.semester}`}
                </p>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                What's happening?
              </label>
              <textarea
                value={uploadForm.content}
                onChange={(e) => setUploadForm({ ...uploadForm, content: e.target.value })}
                placeholder="Share your question, resource, or discussion topic..."
                rows={4}
                maxLength={1000}
                className="w-full p-4 bg-paper border border-ink/15 rounded font-body text-ink resize-vertical focus:outline-none focus:border-ink"
              />
              <p className="font-mono text-[10px] text-ink-soft mt-1 text-right">
                {uploadForm.content.length}/1000
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                <Book className="w-3.5 h-3.5" />
                Subject
              </label>
              <select
                value={uploadForm.subject}
                onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink"
              >
                <option value="">Select subject...</option>
                <option value="DSA">Data Structures & Algorithms</option>
                <option value="OS">Operating Systems</option>
                <option value="Java">Java Programming</option>
                <option value="Python">Python</option>
                <option value="Web Dev">Web Development</option>
                <option value="ML">Machine Learning</option>
                <option value="DBMS">Database Management</option>
                <option value="CN">Computer Networks</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                <Play className="w-3.5 h-3.5" />
                Add resource (optional)
              </label>
              <div
                className={`relative border-2 border-dashed rounded-sm p-8 text-center transition-colors cursor-pointer ${
                  isDragging ? 'border-redpen bg-redpen/5' : 'border-ink/25 hover:border-ink/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadForm.file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-paper border border-ink/10 rounded flex items-center justify-center">
                      <Play className="w-6 h-6 text-ink-soft" />
                    </div>
                    <p className="font-body font-semibold text-ink truncate max-w-md mx-auto">{uploadForm.file.name}</p>
                    <p className="font-mono text-xs text-ink-soft">{(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="mx-auto flex items-center gap-1.5 px-4 py-1.5 text-redpen font-body font-medium text-sm hover:bg-redpen/5 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-paper border border-ink/10 rounded flex items-center justify-center">
                      <Play className="w-6 h-6 text-ink-soft" />
                    </div>
                    <p className="font-body font-semibold text-ink">Drop your file here</p>
                    <p className="font-body text-sm text-ink-soft">or click to browse</p>
                    <p className="font-mono text-[10px] text-ink-soft">PDF, Images, Docs (Max 10MB)</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                />
              </div>
            </div>

            {/* Post type */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUploadForm({ ...uploadForm, type: 'question' })}
                className={`flex flex-col items-center p-4 rounded-sm border transition-colors ${
                  uploadForm.type === 'question' ? 'bg-ink text-paper border-ink' : 'bg-paper border-ink/15 text-ink hover:border-ink/40'
                }`}
              >
                <MessageCircle className="w-4 h-4 mb-2" />
                <span className="font-body font-semibold text-sm">Question</span>
                <span className="font-mono text-[10px] mt-1 opacity-70">Ask doubts</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadForm({ ...uploadForm, type: 'resource' })}
                className={`flex flex-col items-center p-4 rounded-sm border transition-colors ${
                  uploadForm.type === 'resource' ? 'bg-ink text-paper border-ink' : 'bg-paper border-ink/15 text-ink hover:border-ink/40'
                }`}
              >
                <Play className="w-4 h-4 mb-2" />
                <span className="font-body font-semibold text-sm">Resource</span>
                <span className="font-mono text-[10px] mt-1 opacity-70">Share files</span>
              </button>
            </div>
          </div>

          <div className="p-6 border-t border-dashed border-ink/15 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={uploading}
              className="flex-1 px-6 py-3.5 border border-ink/15 text-ink font-body font-semibold rounded hover:bg-paper transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadPost}
              disabled={!uploadForm.content.trim() || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-ink text-paper font-body font-semibold rounded hover:bg-redpen transition-colors disabled:opacity-40"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                'Post now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}