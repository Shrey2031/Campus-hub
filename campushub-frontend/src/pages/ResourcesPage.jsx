
import { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, Download, ChevronLeft, Play, Share2, Bookmark, MoreHorizontal, X, Upload } from 'lucide-react';
import safeStorage from '../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', subject: '' });
  const fileInputRef = useRef(null);
  const token = safeStorage.getItem('token');
  const navigate = useNavigate();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;


  // 🔥 SUBJECT OPTIONS
  const subjects = [
    'Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems',
    'Computer Networks', 'Software Engineering', 'Web Development', 
    'Machine Learning', 'Artificial Intelligence', 'Mathematics',
    'Physics', 'Chemistry', 'Biology', 'English', 'Programming'
  ];

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/resources/top/?type=resource&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(Array.isArray(res.data.resources) ? res.data.resources : []);
    } catch (error) {
      console.error('Resources error:', error);
      setError('Failed to load resources');
      setResources([]);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const resourcesCount = resources.length || 0;

  // 🔥 UPLOAD HANDLER
  const handleUploadResource = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('type', 'resource');
    formDataToSend.append('file', selectedFile);

    setUploading(true);
    try {
      await axios.post(`${API_BASE_URL}/posts/create-post`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Resource uploaded successfully! 🎉');
      setFormData({ title: '', subject: '' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowUploadModal(false);
      await fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) {
      toast.error('File too large! Max 50MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('doc')) return '📝';
    if (mimeType?.includes('zip')) return '📦';
    if (mimeType?.includes('ppt')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6 shadow-xl"></div>
          <p className="text-xl font-semibold text-gray-700">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 🔥 IMPROVED HEADER - INDIGO THEME */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-16">
            <div className="flex items-center gap-4 flex-shrink-0">
              <button 
                onClick={() => navigate(-1)}
                className="p-3 bg-white/80 hover:bg-white rounded-3xl transition-all shadow-xl hover:shadow-2xl backdrop-blur-md border border-white/60 hover:border-indigo-200"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-5 h-16 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl"></div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent leading-tight">
                    Resources
                  </h1>
                  <p className="text-2xl text-gray-600 font-bold mt-1">
                    {resourcesCount} {resourcesCount === 1 ? 'resource' : 'resources'} available
                  </p>
                </div>
              </div>
            </div>

            {/* 🔥 FAB UPLOAD BUTTON - INDIGO */}
            <button 
              onClick={() => setShowUploadModal(true)}
              className="group ml-auto lg:ml-0 px-8 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-black text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.05] transition-all border-0 flex items-center gap-3 whitespace-nowrap"
            >
              <Upload className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Share Resource
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-24 mb-12">
              <div className="w-28 h-28 mx-auto mb-8 bg-indigo-50/50 rounded-3xl flex items-center justify-center border-4 border-indigo-100 shadow-2xl">
                <Download className="w-14 h-14 text-indigo-500" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">{error}</h2>
              <button 
                onClick={fetchResources}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold px-10 py-5 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all text-xl"
              >
                <Play className="w-5 h-5" />
                Retry
              </button>
            </div>
          )}

          {/* 🔥 IMPROVED RESOURCES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {resources.map((resource) => (
              <div key={resource._id} className="group">
                <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 h-[520px] overflow-hidden border border-white/60 hover:border-indigo-300/70 hover:-translate-y-2">
                  
                  {/* 🔥 HEADER - EXACT INDIGO PROFILE COLORS */}
                  <div className="p-6 border-b border-indigo-50/50 bg-gradient-to-br from-indigo-50/95 to-purple-50/95 h-[140px]">
                    <div className="flex items-start gap-4 h-full">
                      <div className="relative flex-shrink-0 pt-1">
                        <img 
                          src={resource.author?.avatar || 'https://via.placeholder.com/52x52/6B7280/FFFFFF?text=👤'}
                          alt={resource.author?.fullname}
                          className="w-14 h-14 rounded-2xl ring-4 ring-white/80 shadow-2xl object-cover border-4 border-white/60"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/52x52/6B7280/FFFFFF?text=👤'}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-2 py-1">
                        <h4 className="font-black text-lg text-gray-900 truncate">
                          {resource.author?.fullname || resource.author?.username || 'Anonymous'}
                        </h4>
                        {(resource.author?.branch || resource.author?.semester) && (
                          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-100/90 px-3 py-1.5 rounded-full shadow-md">
                            {resource.author.branch && <span>{resource.author.branch}</span>}
                            {resource.author.branch && resource.author.semester && <span>•</span>}
                            {resource.author.semester && <span>Sem {resource.author.semester}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 🔥 MAIN CONTENT */}
                  <div className="p-6 flex flex-col h-[280px]">
                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-200 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 border-4 border-white/50 mx-auto">
                        <span className="text-3xl drop-shadow-lg">{resource.icon || '📄'}</span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-black text-gray-900 mb-4 text-center leading-tight px-3 line-clamp-2">
                      {resource.title || resource.content}
                    </h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6 px-2">
                      <span className="px-3 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-bold text-sm rounded-xl shadow-lg">
                        {resource.subject || 'Study Material'}
                      </span>
                      <span className="px-3 py-2 bg-indigo-500/10 text-indigo-700 font-bold text-sm rounded-xl border border-indigo-200 shadow-sm">
                        {resource.type?.toUpperCase() || 'RESOURCE'}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-auto">
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="text-lg">👁️</span>
                        {resource.views || 0}
                      </span>
                      <span className="text-indigo-600 font-bold">{resource.postType || 'Resource'}</span>
                    </div>
                  </div>

                  {/* 🔥 ACTIONS - INDIGO THEME */}
                  <div className="p-6 bg-gradient-to-r from-indigo-50/95 to-purple-50/95 backdrop-blur-sm border-t border-indigo-100/50 pt-4">
                    <div className="grid grid-cols-5 gap-2">
                      {/* Download */}
                      <a 
                        href={resource.file?.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-center flex items-center justify-center gap-2 group-hover:translate-y-[-1px]"
                      >
                        <Download className="w-5 h-5" />
                        <span className="font-bold">Download</span>
                      </a>
                      
                      {/* Quick Actions */}
                      <button className="p-3 bg-white/90 hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-gray-200/60 hover:border-indigo-300 hover:-translate-y-1">
                        <Share2 className="w-5 h-5 text-gray-700 group-hover:text-indigo-600" />
                      </button>
                      <button className="p-3 bg-white/90 hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-gray-200/60 hover:border-orange-300 hover:-translate-y-1">
                        <Bookmark className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
                      </button>
                      <button className="p-3 bg-white/90 hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-gray-200/60 hover:border-gray-300 hover:-translate-y-1">
                        <MoreHorizontal className="w-5 h-5 text-gray-500 group-hover:text-gray-800" />
                      </button>
                    </div>
                    
                    {/* File Info */}
                    {resource.file?.fileName && (
                      <div className="mt-4 pt-4 border-t border-indigo-100/50">
                        <p className="text-xs text-gray-500 text-center truncate">
                          {resource.file.fileName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔥 EMPTY STATE - INDIGO */}
          {!loading && !error && resources.length === 0 && (
            <div className="text-center py-40">
              <div className="w-36 h-36 mx-auto mb-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/50">
                <BookOpen className="w-20 h-20 text-indigo-400/60" />
              </div>
              <h2 className="text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                No resources yet
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Be the first to share your study notes, PDFs, or important materials with your campus community
              </p>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-black px-14 py-7 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.05] transition-all text-2xl border-0"
              >
                <Upload className="w-7 h-7" />
                Share First Resource
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 FULL-SCREEN UPLOAD MODAL - INDIGO */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white/95 backdrop-blur-3xl rounded-3xl shadow-3xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/50">
              
              {/* 🔥 MODAL HEADER - INDIGO */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600/95 via-purple-600/95 to-indigo-700/95 backdrop-blur-xl rounded-t-3xl p-8 border-b border-white/50 shadow-2xl z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-12 bg-gradient-to-b from-white/80 to-white/40 rounded-2xl shadow-lg"></div>
                    <div>
                      <h2 className="text-3xl font-black text-white drop-shadow-lg">
                        Share New Resource
                      </h2>
                      <p className="text-white/90 font-semibold text-lg mt-1">
                        📚 Help your campus community
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-sm transition-all hover:scale-110 shadow-xl"
                  >
                    <X className="w-6 h-6 text-white" />
                                    </button>
                </div>
              </div>

              {/* 🔥 UPLOAD FORM - INDIGO THEME */}
              <form onSubmit={handleUploadResource} className="p-8 space-y-8">
                
                {/* File Upload */}
                <div>
                  <label className="block text-xl font-black text-gray-900 mb-4">
                    📎 Choose Resource File
                  </label>
                  <div className="relative group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.zip,.rar,.ppt,.pptx,image/*"
                      onChange={handleFileChange}
                      className="w-full p-8 border-2 border-dashed border-indigo-200 rounded-3xl text-center text-2xl font-bold text-gray-500 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer file:mr-8 file:py-4 file:px-10 file:rounded-3xl file:border-0 file:text-xl file:font-black file:bg-gradient-to-r file:from-indigo-600 file:to-purple-700 file:text-white hover:file:from-indigo-700 hover:file:to-purple-800 shadow-xl hover:shadow-2xl"
                      required
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all">
                      <Upload className="w-16 h-16 text-indigo-400 animate-bounce" />
                    </div>
                  </div>
                  
                  {selectedFile && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200/50 rounded-3xl shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 bg-white/80 rounded-2xl shadow-2xl flex items-center justify-center flex-shrink-0 border border-indigo-100/50">
                            <span className="text-3xl">{getFileIcon(selectedFile.type)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-xl text-gray-900 truncate">{selectedFile.name}</p>
                            <p className="text-indigo-700 font-semibold text-lg">{formatFileSize(selectedFile.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl hover:scale-110 transition-all shadow-lg font-bold"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title with Dropdown */}
                <div>
                  <label className="block text-xl font-black text-gray-900 mb-4">
                    📝 Resource Title
                  </label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-6 border-2 border-gray-200/60 rounded-3xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 text-xl font-bold shadow-xl transition-all hover:shadow-2xl bg-white/80"
                    required
                  >
                    <option value="">Choose or type your resource title...</option>
                    <optgroup label="📚 Popular Notes">
                      <option>Data Structures Complete Notes</option>
                      <option>Algorithms Semester 3</option>
                      <option>Database Management Systems</option>
                      <option>Operating Systems Full Notes</option>
                      <option>Computer Networks Notes</option>
                    </optgroup>
                    <optgroup label="📖 Textbooks">
                      <option>CLRS Algorithms Textbook</option>
                      <option>Database System Concepts</option>
                      <option>Modern Operating Systems</option>
                    </optgroup>
                    <optgroup label="💻 Code & Projects">
                      <option>Full Stack Web Development Project</option>
                      <option>Machine Learning Projects</option>
                      <option>React Native Complete Guide</option>
                    </optgroup>
                  </select>
                </div>

                {/* Subject Dropdown */}
                <div>
                  <label className="block text-xl font-black text-gray-900 mb-4">
                    🎓 Subject / Semester
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-6 border-2 border-gray-200/60 rounded-3xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 text-xl font-bold shadow-xl transition-all hover:shadow-2xl bg-white/80"
                    required
                  >
                    <option value="">Select subject...</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploading || !selectedFile || !formData.title || !formData.subject}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-black py-8 px-12 rounded-3xl shadow-3xl hover:shadow-4xl hover:scale-[1.02] transition-all text-2xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0 group"
                >
                  {uploading ? (
                    <>
                      <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Uploading your resource...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-8 h-8 group-hover:rotate-[-10deg] transition-transform" />
                      <span>Share Resource Now</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}