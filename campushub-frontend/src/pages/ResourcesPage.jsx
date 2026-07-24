import { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, Download, ChevronLeft, Share2, Bookmark, MoreHorizontal, X, Upload } from 'lucide-react';
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
  const [activeFilter, setActiveFilter] = useState('All');
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savedResources') || '[]').map(r => r.id);
    } catch {
      return [];
    }
  });
  const fileInputRef = useRef(null);
  const token = safeStorage.getItem('token');
  const navigate = useNavigate();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

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

  // Subjects actually present in the fetched resources, so the filter row
  // never shows a chip with zero matches.
  const availableSubjects = ['All', ...new Set(resources.map(r => r.subject).filter(Boolean))];
  const filteredResources = activeFilter === 'All'
    ? resources
    : resources.filter(r => r.subject === activeFilter);

  const handleShareResource = (resource) => {
    const url = `${window.location.origin}/post/${resource._id}`;
    if (navigator.share) {
      navigator.share({ title: resource.title || resource.content, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Link copied!'));
    }
  };

  const handleSaveResource = (resource) => {
    const saved = JSON.parse(localStorage.getItem('savedResources') || '[]');
    const idx = saved.findIndex(r => r.id === resource._id);

    if (idx > -1) {
      saved.splice(idx, 1);
      toast.success('Removed from saved');
    } else {
      saved.unshift({ id: resource._id, title: resource.title, subject: resource.subject });
      toast.success('Saved to profile');
    }

    localStorage.setItem('savedResources', JSON.stringify(saved.slice(0, 50)));
    setSavedIds(saved.map(r => r.id));
  };

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

      toast.success('Resource uploaded successfully!');
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
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-ink/15 border-t-ink rounded-full animate-spin mx-auto mb-5" />
          <p className="font-display font-bold text-ink text-lg">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-paper">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-12 pb-8 border-b-2 border-dashed border-ink/20">
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 bg-white border border-ink/10 rounded hover:border-ink transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-ink" />
              </button>
              <div>
                <h1 className="font-display font-bold text-ink text-4xl lg:text-5xl leading-tight">
                  Resources
                </h1>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mt-1">
                  {resourcesCount} {resourcesCount === 1 ? 'resource' : 'resources'} available
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="ml-auto lg:ml-0 flex items-center gap-2 bg-ink text-paper font-body font-semibold px-6 py-3 rounded hover:bg-redpen transition-colors"
            >
              <Upload className="w-4 h-4" />
              Share resource
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div className="text-center py-16 mb-8 bg-white border border-redpen/30 rounded-sm">
              <Download className="w-10 h-10 mx-auto mb-4 text-redpen" />
              <h2 className="font-display font-bold text-ink text-xl mb-4">{error}</h2>
              <button
                onClick={fetchResources}
                className="inline-flex items-center gap-2 bg-ink text-paper font-body font-semibold px-6 py-3 rounded hover:bg-redpen transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Subject filter chips */}
          {availableSubjects.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {availableSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setActiveFilter(subject)}
                  className={`font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 rounded border transition-colors ${
                    activeFilter === subject
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-white text-ink-soft border-ink/10 hover:border-ink/30'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource._id} className="bg-white border border-ink/10 rounded-sm overflow-hidden hover:border-ink/30 transition-colors flex flex-col">

                {/* Author header */}
                <div className="p-5 border-b border-dashed border-ink/15 flex items-center gap-3">
                  <img
                    src={resource.author?.avatar || 'https://via.placeholder.com/44x44/16213A/F4F5EF?text=%F0%9F%91%A4'}
                    alt={resource.author?.fullname}
                    className="w-10 h-10 rounded object-cover border border-ink/10"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/44x44/16213A/F4F5EF?text=%F0%9F%91%A4'}
                  />
                  <div className="min-w-0">
                    <h4 className="font-body font-semibold text-sm text-ink truncate">
                      {resource.author?.fullname || resource.author?.username || 'Anonymous'}
                    </h4>
                    {(resource.author?.branch || resource.author?.semester) && (
                      <p className="font-mono text-[10px] text-ink-soft">
                        {resource.author.branch} {resource.author.semester && `· Sem ${resource.author.semester}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-center mb-4">
                    <span className="w-14 h-14 bg-paper border border-ink/10 rounded flex items-center justify-center text-2xl">
                      {resource.icon || '📄'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-ink text-center leading-snug mb-3 line-clamp-2">
                    {resource.title || resource.content}
                  </h3>

                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wide bg-paper border border-ink/10 text-ink px-2.5 py-1 rounded">
                      {resource.subject || 'Study material'}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-redpen px-2.5 py-1 rounded border border-redpen/20">
                      {resource.type?.toUpperCase() || 'RESOURCE'}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 font-mono text-[10px] text-ink-soft mt-auto">
                    <span>👁 {resource.views || 0}</span>
                    <span>{resource.postType || 'Resource'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-dashed border-ink/15">
                  <div className="grid grid-cols-5 gap-2">
                    <a
                      href={resource.file?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-3 bg-ink text-paper font-body font-semibold py-2.5 rounded hover:bg-redpen transition-colors text-center flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    <button
                      onClick={() => handleShareResource(resource)}
                      className="p-2.5 bg-paper border border-ink/10 rounded hover:border-ink transition-colors flex items-center justify-center"
                      aria-label="Share resource"
                    >
                      <Share2 className="w-4 h-4 text-ink-soft" />
                    </button>
                    <button
                      onClick={() => handleSaveResource(resource)}
                      className={`p-2.5 rounded border transition-colors flex items-center justify-center ${
                        savedIds.includes(resource._id)
                          ? 'bg-highlighter/20 border-highlighter/40'
                          : 'bg-paper border-ink/10 hover:border-ink'
                      }`}
                      aria-label="Save resource"
                    >
                      <Bookmark className={`w-4 h-4 ${savedIds.includes(resource._id) ? 'fill-current text-ink' : 'text-ink-soft'}`} />
                    </button>
                  </div>
                  {resource.file?.fileName && (
                    <p className="font-mono text-[10px] text-ink-soft text-center mt-3 truncate">
                      {resource.file.fileName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No results for current filter */}
          {!loading && !error && resources.length > 0 && filteredResources.length === 0 && (
            <div className="text-center py-16 bg-white border border-ink/10 rounded-sm">
              <p className="font-body text-ink-soft">No resources tagged "{activeFilter}" yet.</p>
              <button
                onClick={() => setActiveFilter('All')}
                className="mt-3 font-mono text-xs uppercase tracking-wide text-redpen hover:text-ink transition-colors"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && resources.length === 0 && (
            <div className="text-center py-24 bg-white border border-ink/10 rounded-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-paper border border-ink/10 rounded flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-ink-soft" />
              </div>
              <h2 className="font-display font-bold text-ink text-3xl mb-4">No resources yet</h2>
              <p className="font-body text-ink-soft mb-8 max-w-md mx-auto">
                Be the first to share your study notes, PDFs, or important materials.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 bg-ink text-paper font-body font-semibold px-8 py-3.5 rounded hover:bg-redpen transition-colors"
              >
                <Upload className="w-5 h-5" />
                Share first resource
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60">
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-ink/10">

              <div className="sticky top-0 bg-ink p-6 border-b border-dashed border-ink/40 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-paper text-2xl">Share new resource</h2>
                    <p className="font-body text-paper/70 text-sm mt-1">Help your campus community</p>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-paper" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUploadResource} className="p-6 space-y-6">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                    Choose resource file
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.zip,.rar,.ppt,.pptx,image/*"
                    onChange={handleFileChange}
                    className="w-full p-6 border-2 border-dashed border-ink/25 rounded-sm text-center font-body text-ink-soft hover:border-ink/50 transition-colors cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded file:border-0 file:font-body file:font-semibold file:bg-ink file:text-paper"
                    required
                  />

                  {selectedFile && (
                    <div className="mt-4 p-4 bg-paper border border-ink/10 rounded-sm flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="w-10 h-10 bg-white border border-ink/10 rounded flex items-center justify-center flex-shrink-0 text-xl">
                          {getFileIcon(selectedFile.type)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-body font-semibold text-ink truncate">{selectedFile.name}</p>
                          <p className="font-mono text-xs text-ink-soft">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 text-redpen hover:bg-redpen/5 rounded transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                    Resource title
                  </label>
                  <input
                    type="text"
                    list="resource-title-suggestions"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Data Structures Complete Notes"
                    className="w-full p-3.5 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink"
                    required
                  />
                  <datalist id="resource-title-suggestions">
                    <option value="Data Structures Complete Notes" />
                    <option value="Algorithms Semester 3" />
                    <option value="Database Management Systems" />
                    <option value="Operating Systems Full Notes" />
                    <option value="Computer Networks Notes" />
                    <option value="CLRS Algorithms Textbook" />
                    <option value="Database System Concepts" />
                    <option value="Modern Operating Systems" />
                    <option value="Full Stack Web Development Project" />
                    <option value="Machine Learning Projects" />
                    <option value="React Native Complete Guide" />
                  </datalist>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                    Subject / semester
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3.5 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink"
                    required
                  >
                    <option value="">Select subject...</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !selectedFile || !formData.title || !formData.subject}
                  className="w-full bg-ink text-paper font-body font-semibold py-4 rounded hover:bg-redpen transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                      Uploading your resource...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Share resource now
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