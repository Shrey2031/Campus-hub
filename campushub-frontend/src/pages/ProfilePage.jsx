import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft, User, Mail, Phone, Edit3, Camera, Save, X,
  GraduationCap, Calendar, UploadCloud, FileText, AlignLeft,
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
  const [resourcesCount, setResourcesCount] = useState(0);
  const fileInputRef = useRef(null);
  const token = safeStorage.getItem('token');
  const navigate = useNavigate();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  // Takes userId as a param rather than reading `user` from the closure —
  // this was called right after setUser(userData), and since state updates
  // aren't synchronous, `user` was still the *previous* value (null on
  // first load), so the count was always computed against stale data.
  const fetchResourcesCount = useCallback(async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/resources/top/?type=resource&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userResources = Array.isArray(res.data.resources) ? res.data.resources : [];
      const count = userResources.filter(resource => resource.author?._id === userId).length;
      setResourcesCount(count);
    } catch (error) {
      console.error('Resources count error:', error);
      setResourcesCount(0);
    }
  }, [token]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = res.data.data.user;
      setUser(userData);
      setFormData(userData);
      await fetchResourcesCount(userData._id);
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Editable fields only — formData is seeded from the full user object
  // returned by the API, and blindly spreading Object.keys(formData) into
  // the update request was sending _id, createdAt, __v, followers (an
  // array, which FormData would've stringified to "[object Object]"), and
  // other fields the backend never asked for.
  const EDITABLE_FIELDS = ['fullname', 'email', 'phone', 'username', 'branch', 'semester', 'bio'];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updateData = new FormData();
      EDITABLE_FIELDS.forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          updateData.append(key, formData[key]);
        }
      });

      await axios.put(`${API_BASE_URL}/users/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
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
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
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
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-ink/15 border-t-ink rounded-full animate-spin mx-auto mb-5" />
          <p className="font-display font-bold text-ink text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-6 text-ink/20" />
          <h1 className="font-display font-bold text-ink text-2xl mb-4">Profile not found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-ink text-paper font-body font-semibold px-8 py-3 rounded hover:bg-redpen transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    postCount: user?.postCount || 0,
    resourceCount: resourcesCount,
    totalViews: user?.totalViews || 0,
    followersCount: user?.followers?.length || 0
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 p-2.5 bg-white border border-ink/10 rounded hover:border-ink transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4 text-ink" />
          <span className="font-body text-sm font-medium text-ink">Back</span>
        </button>

        {/* Profile header — ID card layout */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start mb-10">

          {/* Student ID card */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="w-full max-w-xs bg-white border border-ink/10 rounded-sm shadow-[0_16px_40px_-12px_rgba(22,33,58,0.3)] p-6 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
              {/* Lanyard punch + perforation */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full border border-ink/20 bg-paper" />
                <span className="flex-1 border-t border-dashed border-ink/20" />
                <span className="w-2.5 h-2.5 rounded-full border border-ink/20 bg-paper" />
              </div>

              <div className="flex items-center gap-1.5 justify-center mb-5">
                <span className="w-4 h-4 bg-ink rounded-[2px]" />
                <span className="font-mono text-[10px] tracking-widest text-ink-soft uppercase">CampusHub · Student ID</span>
              </div>

              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-sm overflow-hidden border border-ink/10">
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/120x120/16213A/F4F5EF?text=%F0%9F%91%A4'}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/120x120/16213A/F4F5EF?text=%F0%9F%91%A4'}
                  />
                </div>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  title="Change photo"
                  aria-label="Change photo"
                  className="absolute -bottom-2 -right-2 p-1.5 bg-highlighter text-ink rounded hover:bg-ink hover:text-paper transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <h1 className="font-display font-bold text-ink text-xl text-center mb-2 truncate">
                {user?.fullname || user?.username || 'Student'}
              </h1>
              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-paper border border-ink/10 rounded font-mono text-[10px] uppercase tracking-wide text-ink">
                  <GraduationCap className="w-3 h-3" />
                  {user?.branch || 'Branch'} · Sem {user?.semester || '?'}
                </span>
              </div>

              <div className="border-t border-dashed border-ink/20 pt-4">
                <div className="flex items-end gap-[3px] h-6 mb-2 justify-center">
                  {[6, 3, 5, 2, 4, 6, 2, 5, 3, 6, 4, 2, 5, 3, 6, 2, 4, 5, 3, 6].map((h, i) => (
                    <span key={i} className="w-[2.5px] bg-ink/70" style={{ height: `${h * 4}px` }} />
                  ))}
                </div>
                <p className="font-mono text-[10px] text-ink-soft text-center tracking-widest">
                  ID · {(user?._id || '').slice(-8).toUpperCase() || 'PENDING'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="w-full max-w-xs bg-ink text-paper font-body font-semibold py-2.5 px-6 rounded hover:bg-redpen transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {editing ? 'Cancel editing' : 'Edit profile'}
            </button>
          </div>

          {/* Stats ticket strip */}
          <div className="bg-ink rounded-sm border border-ink/10 p-6 lg:p-8 h-full">
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper/50 mb-6">Activity record</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-dashed divide-paper/15">
              {[
                { icon: FileText, label: 'Posts', value: stats.postCount },
                { icon: TrendingUp, label: 'Resources', value: resourcesCount, marked: true },
                { icon: Eye, label: 'Views', value: stats.totalViews.toLocaleString() },
                { icon: Users, label: 'Followers', value: stats.followersCount }
              ].map(({ icon: Icon, label, value, marked }, idx) => (
                <div key={idx} className="py-4 sm:py-0 sm:px-6 first:sm:pl-0 text-center sm:text-left">
                  <Icon className="w-4 h-4 mb-3 text-paper/40 mx-auto sm:mx-0" />
                  <p className={`font-display font-bold text-3xl mb-1 ${marked ? 'marker-dark inline-block' : 'text-paper'}`}>
                    {value}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wide text-paper/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-ink/10 rounded-sm p-8">
            <div className="flex items-center gap-3 pb-5 mb-6 border-b border-dashed border-ink/15">
              <span className="font-mono text-[10px] text-redpen border border-redpen/30 rounded px-1.5 py-0.5">01</span>
              <h2 className="font-display font-bold text-ink text-xl">Personal info</h2>
            </div>
            <div className="space-y-5">
              <Field label="Full name" icon={User} value={formData.fullname || ''} onChange={(val) => setFormData({ ...formData, fullname: val })} editing={editing} type="text" />
              <Field label="Email" icon={Mail} value={formData.email || ''} onChange={(val) => setFormData({ ...formData, email: val })} editing={editing} type="email" />
              <Field label="Phone" icon={Phone} value={formData.phone || ''} onChange={(val) => setFormData({ ...formData, phone: val })} editing={editing} type="tel" />
              <Field label="Username" icon={Shield} value={formData.username || ''} onChange={(val) => setFormData({ ...formData, username: val })} editing={editing} type="text" />
            </div>
          </div>

          <div className="bg-white border border-ink/10 rounded-sm p-8">
            <div className="flex items-center gap-3 pb-5 mb-6 border-b border-dashed border-ink/15">
              <span className="font-mono text-[10px] text-redpen border border-redpen/30 rounded px-1.5 py-0.5">02</span>
              <h2 className="font-display font-bold text-ink text-xl">Academic info</h2>
            </div>
            <div className="space-y-5">
              <FieldSelect
                label="Branch"
                icon={GraduationCap}
                value={formData.branch || ''}
                onChange={(val) => setFormData({ ...formData, branch: val })}
                editing={editing}
                options={["Computer Science", "Electronics & Comm", "Mechanical", "Civil Engineering", "Information Technology", "Electrical"]}
              />
              <FieldSelect
                label="Semester"
                icon={Calendar}
                value={formData.semester || ''}
                onChange={(val) => setFormData({ ...formData, semester: val })}
                editing={editing}
                options={[1, 2, 3, 4, 5, 6, 7, 8].map(s => `Sem ${s}`)}
              />
              <FieldTextarea label="About" icon={AlignLeft} value={formData.bio || ''} onChange={(val) => setFormData({ ...formData, bio: val })} editing={editing} />
            </div>
          </div>
        </div>

        {editing && (
          <div className="mt-8 bg-white border border-ink/10 rounded-sm p-8">
            <button
              onClick={handleUpdateProfile}
              disabled={updating}
              className="w-full lg:w-auto lg:ml-auto lg:block bg-ink text-paper font-body font-semibold py-3.5 px-10 rounded hover:bg-redpen transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

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

// Note: dropped the dynamic `color` prop here — template strings like
// `text-${color}-500` never get picked up by Tailwind's build, so those
// classes were silently missing no matter what was passed in.
const Field = ({ label, icon: Icon, value, onChange, editing, type = "text" }) => (
  <div>
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={!editing}
      className={`w-full px-4 py-3 border rounded font-body text-ink transition-colors focus:outline-none focus:border-ink ${
        editing ? 'bg-paper border-ink/15' : 'bg-white border-ink/10 cursor-not-allowed opacity-70'
      }`}
    />
  </div>
);

const FieldSelect = ({ label, icon: Icon, value, onChange, editing, options }) => (
  <div>
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={!editing}
      className={`w-full px-4 py-3 border rounded font-body text-ink transition-colors focus:outline-none focus:border-ink ${
        editing ? 'bg-paper border-ink/15' : 'bg-white border-ink/10 cursor-not-allowed opacity-70'
      }`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const FieldTextarea = ({ label, icon: Icon, value, onChange, editing }) => (
  <div>
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    <textarea
      rows={editing ? 4 : 3}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={!editing}
      placeholder={editing ? "Tell us about yourself..." : ""}
      className={`w-full px-4 py-3 border rounded font-body text-ink resize-vertical transition-colors focus:outline-none focus:border-ink ${
        editing ? 'bg-paper border-ink/15' : 'bg-white border-ink/10 cursor-not-allowed opacity-70'
      }`}
    />
  </div>
);

const AvatarModalCompact = ({ avatarFile, setAvatarFile, handleAvatarUpload, setShowAvatarModal, fileInputRef }) => (
  <div className="fixed inset-0 z-[100] bg-ink/70 flex items-center justify-center p-4 sm:p-6">
    <div className="bg-white rounded-sm shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden border border-ink/10">
      <div className="bg-ink p-6 border-b-2 border-dashed border-ink/40 flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-paper text-xl">Change photo</h3>
          <p className="font-body text-paper/70 text-sm mt-0.5">Upload a professional headshot</p>
        </div>
        <button
          onClick={() => { setShowAvatarModal(false); setAvatarFile(null); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4 text-paper" />
        </button>
      </div>

      <div className="p-6 text-center">
        <div
          className="relative mx-auto w-40 h-40 mb-6 border-2 border-dashed border-ink/25 rounded-sm cursor-pointer hover:border-ink/50 transition-colors flex items-center justify-center"
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
            <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full rounded-sm object-cover" />
          ) : (
            <div className="space-y-2">
              <UploadCloud className="w-8 h-8 mx-auto text-ink-soft" />
              <p className="font-body font-semibold text-ink">Click to upload</p>
              <p className="font-mono text-xs text-ink-soft">JPG, PNG (Max 5MB)</p>
            </div>
          )}
        </div>

        {avatarFile && (
          <div className="bg-paper p-4 rounded-sm border border-ink/10 mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-9 h-9 rounded object-cover flex-shrink-0" />
              <div className="min-w-0 text-left">
                <p className="font-body font-semibold text-sm text-ink truncate">{avatarFile.name}</p>
                <p className="font-mono text-[10px] text-ink-soft">{(avatarFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={() => { setAvatarFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="p-1.5 text-redpen hover:bg-redpen/5 rounded transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAvatarUpload}
            disabled={!avatarFile}
            className="flex-1 py-3 bg-ink text-paper font-body font-semibold rounded hover:bg-redpen transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Update photo
          </button>
          <button
            onClick={() => { setShowAvatarModal(false); setAvatarFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
            className="flex-1 py-3 border border-ink/15 text-ink font-body font-semibold rounded hover:bg-paper transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePage;