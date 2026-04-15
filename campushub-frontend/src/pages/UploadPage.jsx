

import { useState, useMemo, useRef } from 'react';
import { Book, Play, X, ChevronLeft, MessageCircle } from 'lucide-react';
import safeStorage from '../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    content: '',
    subject: '',
    type: 'question',
    file: null
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
    
    if (uploadForm.file) {
      formData.append('file', uploadForm.file);
    }

    try {
      await axios.post('http://localhost:5000/api/v1/posts/create-post', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Post uploaded successfully! 🎉');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadForm({ ...uploadForm, file: null });
    fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setUploadForm({ ...uploadForm, file: e.dataTransfer.files[0] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header - NORMAL SIZE */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/50 rounded-2xl transition-all shadow-sm border border-white/50 hover:border-indigo-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-3 h-12 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-700 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Create Post
              </h1>
              <p className="text-xl text-gray-600 font-medium">Share with your campus</p>
            </div>
          </div>
        </div>

        {/* 🔥 MAIN CARD - PERFECT MEDIUM SIZE */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          
          {/* User Header - NORMAL SIZE */}
          <div className="p-6 border-b border-indigo-50/50 bg-gradient-to-r from-indigo-50/95 to-purple-50/95">
            <div className="flex items-start gap-4">
              <img 
                src={currentUser.avatar || 'https://via.placeholder.com/56x56/6B7280/FFFFFF?text=👤'}
                alt={currentUser.fullname}
                className="w-16 h-16 rounded-2xl ring-3 ring-white/50 shadow-xl flex-shrink-0 object-cover border-2 border-white/60"
                onError={(e) => e.target.src = 'https://via.placeholder.com/56x56/6B7280/FFFFFF?text=👤'}
              />
              <div className="flex-1 min-w-0 space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-xl text-gray-900 truncate">
                    {currentUser.fullname || currentUser.username || 'User'}
                  </h2>
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-sm ring-2 ring-white animate-pulse"></div>
                </div>
                {(currentUser.branch || currentUser.semester) && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-100/90 px-4 py-1.5 rounded-2xl border border-indigo-200/50">
                    {currentUser.branch && <span>{currentUser.branch}</span>}
                    {currentUser.branch && currentUser.semester && <span>•</span>}
                    {currentUser.semester && <span>Sem {currentUser.semester}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form - NORMAL SPACING */}
          <div className="p-8 space-y-6">
            
            {/* Content - NORMAL SIZE */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4">What's happening?</label>
              <textarea
                value={uploadForm.content}
                onChange={(e) => setUploadForm({ ...uploadForm, content: e.target.value })}
                placeholder="Share your question, resource, or discussion topic..."
                rows={4}
                className="w-full p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 resize-vertical shadow-lg transition-all text-lg font-medium bg-white/80"
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-2 text-right">
                {uploadForm.content.length}/1000 characters
              </p>
            </div>

            {/* Subject - NORMAL SIZE */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-indigo-600" />
                Subject
              </label>
              <select
                value={uploadForm.subject}
                onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-lg transition-all appearance-none bg-white/80 text-lg"
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

            {/* File Upload - NORMAL SIZE */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-600" />
                Add Resource (Optional)
              </label>
              <div 
                className="relative border-3 border-dashed border-indigo-200/60 rounded-2xl p-10 text-center hover:border-indigo-400 hover:bg-gradient-to-b hover:from-indigo-50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer group hover:shadow-xl bg-white/80"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-indigo-500', 'bg-gradient-to-b', 'from-indigo-50', 'to-purple-50');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-indigo-500', 'bg-gradient-to-b', 'from-indigo-50', 'to-purple-50');
                }}
                onDrop={handleDrop}
              >
                {uploadForm.file ? (
                  <div className="space-y-3 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-gray-900 truncate max-w-md mx-auto">{uploadForm.file.name}</p>
                      <p className="text-base font-semibold text-indigo-700 mt-1">
                        {(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button 
                      onClick={removeFile}
                      className="mx-auto block px-5 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all shadow-md">
                      <Play className="w-8 h-8 text-indigo-500 group-hover:text-indigo-700 transition-all" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-all mb-1">
                        Drop your file here
                      </p>
                      <p className="text-lg font-semibold text-gray-600 group-hover:text-indigo-600 transition-all">
                        or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PDF, Images, Docs (Max 10MB)</p>
                    </div>
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

            {/* Post Type - NORMAL SIZE */}
            <div className="p-6 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 rounded-2xl border border-indigo-200/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className={`flex flex-col items-center p-4 rounded-2xl transition-all cursor-pointer group flex-1 ${
                  uploadForm.type === 'question' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/25' 
                    : 'bg-white/90 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg'
                }`}
                onClick={() => setUploadForm({ ...uploadForm, type: 'question' })}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    uploadForm.type === 'question' ? 'bg-white shadow-sm' : 'bg-indigo-500/20'
                  }`}>
                    {uploadForm.type === 'question' ? (
                      <div className="w-2 h-2 bg-indigo-600 rounded-sm"></div>
                    ) : (
                      <MessageCircle className="w-3 h-3 text-indigo-600" />
                    )}
                  </div>
                  <span className="font-bold text-sm group-hover:text-indigo-700 transition-all">Question</span>
                  <span className={`text-xs mt-1 px-2 py-0.5 rounded-full font-medium transition-all ${
                    uploadForm.type === 'question' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200/80'
                  }`}>
                    Ask doubts
                  </span>
                </div>

                <div className={`flex flex-col items-center p-4 rounded-2xl transition-all cursor-pointer group flex-1 ${
                  uploadForm.type === 'resource' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/25' 
                    : 'bg-white/90 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg'
                }`}
                onClick={() => setUploadForm({ ...uploadForm, type: 'resource' })}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    uploadForm.type === 'resource' ? 'bg-white shadow-sm' : 'bg-indigo-500/20'
                  }`}>
                    {uploadForm.type === 'resource' ? (
                      <div className="w-2 h-2 bg-indigo-600 rounded-sm"></div>
                    ) : (
                      <Play className="w-3 h-3 text-indigo-600" />
                    )}
                  </div>
                  <span className="font-bold text-sm group-hover:text-indigo-700 transition-all">Resource</span>
                  <span className={`text-xs mt-1 px-2 py-0.5 rounded-full font-medium transition-all ${
                    uploadForm.type === 'resource' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200/80'
                  }`}>
                    Share files
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons - NORMAL SIZE */}
          <div className="p-6 border-t border-indigo-100/50 bg-gradient-to-r from-indigo-50/95 to-purple-50/95">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-800 font-bold rounded-2xl hover:bg-gray-50 hover:border-indigo-300 transition-all shadow-lg hover:shadow-xl text-base bg-white/80"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadPost}
                disabled={!uploadForm.content.trim() || uploading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Post Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}