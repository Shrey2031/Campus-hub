import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, User, Mail, Phone, Edit3, Camera, Save, X, 
  MapPin, GraduationCap, Award, Calendar, UploadCloud, FileText,
  Eye, Users, TrendingUp, Shield 
} from 'lucide-react';
import safeStorage from '../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [resourcesCount, setResourcesCount] = useState(0); // 🔥 Real resources count
  const fileInputRef = useRef(null);
  const token = safeStorage.getItem('token');
  const navigate = useNavigate();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;


  // 🔥 EXACT SAME fetchResourcesCount as your ResourcesPage
  const fetchResourcesCount = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/resources/top/?type=resource&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userResources = Array.isArray(res.data.resources) ? res.data.resources : [];
      const count = userResources.filter(resource => 
        resource.author?._id === user?._id
      ).length;
      
      setResourcesCount(count);
    } catch (error) {
      console.error('Resources count error:', error);
      setResourcesCount(0);
    }
  }, [token, user?._id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = res.data.data.user;
      setUser(userData);
      setFormData(userData);
      
      // 🔥 Fetch real resources count
      await fetchResourcesCount();
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updateData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && key !== 'avatar' && formData[key] !== undefined) {
          updateData.append(key, formData[key]);
        }
      });

      await axios.put(`${API_BASE_URL}/users/profile`, updateData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      await fetchProfile();
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formDataUpload = new FormData();
    formDataUpload.append('avatar', avatarFile);

    try {
      await axios.patch(`${API_BASE_URL}/users/avatar`, formDataUpload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchProfile();
      setAvatarFile(null);
      setShowAvatarModal(false);
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Avatar upload failed');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/80 to-white/70 flex items-center justify-center p-8">
        <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-12 shadow-2xl border border-indigo-200/50 max-w-sm mx-auto">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6 shadow-xl"></div>
          <p className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/80 to-white/70 flex items-center justify-center p-8">
        <div className="text-center backdrop-blur-xl bg-white/90 rounded-2xl p-12 shadow-2xl border border-indigo-200/50">
          <User className="w-24 h-24 mx-auto mb-6 text-indigo-300" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold px-8 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // 🔥 Stats with real resources count
  const stats = {
    postCount: user?.postCount || 0,
    resourceCount: resourcesCount,
    totalViews: user?.totalViews || 0,
    followersCount: user?.followers?.length || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/80 via-white/75 to-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 lg:mb-8 p-3 bg-white/90 hover:bg-white rounded-xl shadow-lg hover:shadow-xl backdrop-blur-xl border border-indigo-100/50 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 group"
        >
          <ChevronLeft className="w-5 h-5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline text-sm font-medium text-gray-700">Back</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden mb-8 lg:mb-12">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800/90 p-8 lg:p-12 border-b border-indigo-200/30">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8 max-w-4xl mx-auto">
              {/* Avatar & Edit */}
              <div className="flex flex-col items-center lg:items-start gap-4 lg:flex-shrink-0">
                <div className="group relative">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/60 bg-gradient-to-br from-indigo-100/80 to-purple-100/80 border-3 border-white/70">
                    <img 
                      src={user?.avatar || 'https://via.placeholder.com/120x120/6B7280/FFFFFF?text=👤'}
                      alt="Avatar"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/120x120/6B7280/FFFFFF?text=👤'}
                    />
                  </div>
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute -bottom-2 -right-2 p-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl border-2 border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:rotate-6 z-20"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => setEditing(!editing)}
                  className="group relative bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-102 border-0 backdrop-blur-xl text-sm w-full lg:w-auto"
                >
                  <div className="absolute inset-0 bg-white/20 rotate-[-20deg] scale-150 group-hover:scale-[1.1] transition-all duration-500 -z-10 rounded-xl"></div>
                  <div className="flex items-center justify-center gap-1.5 relative z-10">
                    <Edit3 className={`w-4 h-4 ${editing ? 'rotate-180' : ''} transition-transform duration-300`} />
                    <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
                  </div>
                </button>
              </div>

              {/* Profile Info & Stats */}
              <div className="flex-1 min-w-0 lg:pl-4">
                <h1 className="text-2xl lg:text-3xl font-black mb-2 bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text leading-tight">
                  {user?.fullname || user?.username || 'Student'}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl mb-6 text-sm font-semibold">
                  <GraduationCap className="w-4 h-4 flex-shrink-0" />
                  <span>{user?.branch || 'Branch'} • {user?.semester || '?'} Semester</span>
                </div>
                
                {/* 🔥 REAL STATS CARDS WITH RESOURCES COUNT */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: FileText, label: 'Posts', value: stats.postCount, color: 'indigo', subtitle: 'Q & Discussions' },
                    { icon: TrendingUp, label: 'Resources', value: resourcesCount, color: 'purple', subtitle: 'Files Shared' },
                    { icon: Eye, label: 'Views', value: stats.totalViews.toLocaleString(), color: 'indigo' },
                    { icon: Users, label: 'Followers', value: stats.followersCount, color: 'purple' }
                  ].map(({ icon: Icon, label, value, color, subtitle }, idx) => (
                    <div key={idx} className="group p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center">
                      <div className={`w-12 h-12 bg-white/30 rounded-xl mb-3 mx-auto flex items-center justify-center group-hover:bg-white/50 transition-all text-${color}-100`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-white text-xs uppercase tracking-wide mb-1">{label}</p>
                      <p className="text-2xl font-black text-white drop-shadow-md">{value}</p>
                      {subtitle && <p className="text-xs text-white/80 mt-1">{subtitle}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Personal Info */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-100/60 p-8 lg:p-10 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center gap-3 pb-6 mb-8 border-b border-indigo-100/50">
              <div className="w-2 h-10 bg-gradient-to-b from-indigo-600 to-indigo-700 rounded-xl shadow-lg"></div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Personal Info
              </h2>
            </div>
            <div className="space-y-6">
              <Field label="Full Name" icon={User} value={formData.fullname || ''} onChange={(val) => setFormData({ ...formData, fullname: val })} editing={editing} type="text" color="indigo" />
              <Field label="Email" icon={Mail} value={formData.email || ''} onChange={(val) => setFormData({ ...formData, email: val })} editing={editing} type="email" color="indigo" />
              <Field label="Phone" icon={Phone} value={formData.phone || ''} onChange={(val) => setFormData({ ...formData, phone: val })} editing={editing} type="tel" color="purple" />
              <Field label="Username" icon={Shield} value={formData.username || ''} onChange={(val) => setFormData({ ...formData, username: val })} editing={editing} type="text" color="indigo" />
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-100/60 p-8 lg:p-10 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center gap-3 pb-6 mb-8 border-b border-purple-100/50">
              <div className="w-2 h-10 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-xl shadow-lg"></div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent">
                Academic Info
              </h2>
            </div>
            <div className="space-y-6">
              <FieldSelect 
                label="Branch" 
                icon={GraduationCap}
                value={formData.branch || ''}
                onChange={(val) => setFormData({ ...formData, branch: val })}
                editing={editing}
                options={["Computer Science", "Electronics & Comm", "Mechanical", "Civil Engineering", "Information Technology", "Electrical"]}
                color="indigo"
              />
              <FieldSelect 
                label="Semester" 
                icon={Calendar}
                value={formData.semester || ''}
                onChange={(val) => setFormData({ ...formData, semester: val })}
                editing={editing}
                options={[1,2,3,4,5,6,7,8].map(s => `Sem ${s}`)}
                color="purple"
              />
              <FieldTextarea label="About" icon={MapPin} value={formData.bio || ''} onChange={(val) => setFormData({ ...formData, bio: val })} editing={editing} color="purple" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {editing && (
          <div className="mt-12 pt-10 border-t border-indigo-100/50">
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-100/60 p-8 lg:p-10">
              <button 
                onClick={handleUpdateProfile}
                disabled={updating}
                className="w-full lg:w-auto lg:ml-auto group relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-purple-800 text-white font-bold py-4 px-12 rounded-3xl shadow-3xl hover:shadow-4xl transition-all duration-300 hover:scale-102 border-0 backdrop-blur-xl mx-auto lg:ml-auto disabled:opacity-50 disabled:cursor-not-allowed max-w-sm text-lg"
              >
                <div className="absolute inset-0 bg-white/20 rotate-12 scale-150 group-hover:scale-[1.1] transition-all duration-500 -z-10 rounded-3xl"></div>
                <div className="flex items-center justify-center gap-3 relative z-10">
                  {updating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <AvatarModalCompact 
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          handleAvatarUpload={handleAvatarUpload}
          setShowAvatarModal={setShowAvatarModal}
          fileInputRef={fileInputRef}
        />
      )}
    </div>
  );
};

// 🔥 Field Components (same as before)
const Field = ({ label, icon: Icon, value, onChange, editing, type = "text", color = "indigo" }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Icon className={`w-4 h-4 text-${color}-500 flex-shrink-0`} />
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={!editing}
        className={`w-full px-4 py-3 pl-11 pr-4 border-2 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-${color}-200/50 hover:shadow-xl ${
          editing 
            ? `border-${color}-200/50 bg-gradient-to-r from-${color}-50/70 via-white/90 to-white/80 focus:border-${color}-400 focus:shadow-2xl` 
            : 'border-gray-200/50 bg-white/80 cursor-not-allowed opacity-75 hover:shadow-lg'
        }`}
      />
      <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-${color}-400 group-hover:text-${color}-500 transition-colors duration-300 pointer-events-none`} />
    </div>
    {!editing && <p className="text-xs text-gray-500 mt-1.5 px-1">{value || 'Not set'}</p>}
  </div>
);

const FieldSelect = ({ label, icon: Icon, value, onChange, editing, options, color = "indigo" }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
      <Icon className={`w-4 h-4 text-${color}-500 flex-shrink-0`} />
      {label}
    </label>
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={!editing}
        className={`w-full px-4 py-3 pl-11 pr-10 border-2 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300 appearance-none focus:outline-none focus:ring-4 focus:ring-${color}-200/50 hover:shadow-xl ${
          editing 
            ? `border-${color}-200/50 bg-gradient-to-r from-${color}-50/70 via-white/90 to-white/80 focus:border-${color}-400 focus:shadow-2xl` 
            : 'border-gray-200/50 bg-white/80 cursor-not-allowed opacity-75 hover:shadow-lg'
        }`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
      <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-${color}-400 group-hover:text-${color}-500 transition-colors duration-300 pointer-events-none`} />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className={`w-5 h-5 text-${color}-400 group-hover:text-${color}-500 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {!editing && <p className="text-xs text-gray-500 mt-1.5 px-1">{value || 'Not set'}</p>}
  </div>
);

const FieldTextarea = ({ label, icon: Icon, value, onChange, editing, color = "purple" }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
      <Icon className={`w-4 h-4 text-${color}-500 flex-shrink-0`} />
      {label}
    </label>
    <div className="relative">
      <textarea
        rows={editing ? 4 : 3}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={!editing}
        placeholder={editing ? "Tell us about yourself..." : ""}
        className={`w-full px-4 py-3 pl-11 pr-4 border-2 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300 resize-vertical focus:outline-none focus:ring-4 focus:ring-${color}-200/50 hover:shadow-xl ${
          editing 
            ? `border-${color}-200/50 bg-gradient-to-r from-${color}-50/70 via-white/90 to-white/80 focus:border-${color}-400 focus:shadow-2xl` 
            : 'border-gray-200/50 bg-white/80 cursor-not-allowed opacity-75 hover:shadow-lg'
        }`}
      />
      <Icon className={`absolute left-3.5 top-3.5 w-5 h-5 text-${color}-400 group-hover:text-${color}-500 transition-colors duration-300 pointer-events-none`} />
    </div>
    {!editing && <p className="text-xs text-gray-500 mt-1.5 px-1 line-clamp-2">{value || 'No bio yet'}</p>}
  </div>
);

// 🔥 Avatar Modal (Compact)
const AvatarModalCompact = ({ avatarFile, setAvatarFile, handleAvatarUpload, setShowAvatarModal, fileInputRef }) => (
  <div className="fixed inset-0 z-[100] bg-gradient-to-br from-black/80 via-indigo-900/70 to-black/80 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6">
    <div className="bg-white/95 backdrop-blur-3xl rounded-3xl shadow-4xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden border border-indigo-200/60">
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 border-b border-indigo-200/50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-8 bg-gradient-to-b from-white/90 to-white/50 rounded-xl shadow-xl"></div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-xl mb-1">Change Photo</h3>
              <p className="text-white/90 font-medium text-xs sm:text-sm">Upload professional headshot</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAvatarModal(false);
              setAvatarFile(null);
            }}
            className="p-2 sm:p-3 bg-white/30 hover:bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-110"
          >
            <X className="w-5 h-5 text-white drop-shadow-md" />
          </button>
        </div>
      </div>
      <div className="p-6 sm:p-8 text-center">
        <div 
          className={`relative mx-auto w-40 h-40 sm:w-48 sm:h-48 mb-6 p-4 sm:p-6 border-4 border-dashed rounded-2xl shadow-3xl cursor-pointer transition-all group hover:scale-105 hover:shadow-4xl ${
            avatarFile 
              ? 'border-indigo-300/70 bg-gradient-to-br from-indigo-50/80 to-white/90' 
              : 'border-indigo-200/50 bg-gradient-to-br from-indigo-50/50 to-white/80 hover:border-indigo-400/70 hover:bg-indigo-50/70'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          {avatarFile ? (
            <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full rounded-2xl object-cover shadow-2xl ring-4 ring-white/60" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl bg-indigo-500/20 text-indigo-500 group-hover:bg-indigo-500/40 group-hover:text-indigo-400 transition-all">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 mb-1">Click to upload</p>
                <p className="text-sm text-indigo-600 font-medium">JPG, PNG (Max 5MB)</p>
              </div>
            </div>
          )}
        </div>

        {avatarFile && (
          <div className="bg-indigo-50/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-indigo-200/60 shadow-2xl mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center p-1">
                  <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full rounded-xl object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-lg text-indigo-900 truncate">{avatarFile.name}</p>
                  <p className="text-sm text-indigo-700 font-medium">{(avatarFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAvatarFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl hover:scale-105 transition-all shadow-lg font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-6 sm:pt-8 border-t border-indigo-100/50">
          <button
            onClick={handleAvatarUpload}
            disabled={!avatarFile}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-base shadow-3xl transition-all flex items-center justify-center gap-2 ${
              avatarFile
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-purple-800 text-white hover:shadow-4xl hover:scale-102'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
            }`}
          >
            <UploadCloud className="w-5 h-5" />
            Update Photo
          </button>
          <button
            onClick={() => {
              setShowAvatarModal(false);
              setAvatarFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-bold text-base rounded-2xl shadow-xl hover:shadow-2xl hover:scale-102 transition-all border border-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePage;
