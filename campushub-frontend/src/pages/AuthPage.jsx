import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Eye, EyeOff, Mail, User, GraduationCap, BookOpen, Lock,
  Users, FileText, MessageCircle, Megaphone, ArrowRight,
  Sparkles, Image, Upload, Loader2, AlertCircle
} from 'lucide-react';
import safeStorage from '../contexts/safeStorage';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    branch: '',
    semester: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/users`;
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const features = [
    {
      icon: FileText,
      title: "Share Notes & PYQs",
      desc: "Upload and access previous year questions, lecture notes, and study materials across all branches."
    },
    {
      icon: MessageCircle,
      title: "Branch-wise Discussions",
      desc: "Connect with students from your branch and semester for doubt clearing and discussions."
    },
    {
      icon: Megaphone,
      title: "College Notifications",
      desc: "Stay updated with all college announcements, exam schedules, and important updates."
    },
    {
      icon: Users,
      title: "Student Community",
      desc: "Network with students from every branch and build your college connections."
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/login', {
        email: formData.email,
        password: formData.password
      });

      const token = response.data.data.accessToken;
      const userData = response.data.data.user;

      safeStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setTimeout(() => {
        console.log('token check:', safeStorage.getItem('token'));
      }, 2000);

      navigate('/home');
      setSuccess('Login successful! Redirecting...');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const signupData = new FormData();
    signupData.append('username', formData.username);
    signupData.append('fullname', formData.fullname);
    signupData.append('email', formData.email);
    signupData.append('password', formData.password);
    signupData.append('branch', formData.branch);
    signupData.append('semester', formData.semester);

    if (formData.avatar) {
      signupData.append('avatar', formData.avatar);
    }

    try {
      const response = await axiosInstance.post('/register', signupData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        setIsLogin(true);
        setFormData({ ...formData, username: '', fullname: '', password: '', branch: '', semester: '', avatar: null });
        setAvatarPreview(null);
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (isLogin) {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24 max-w-7xl">
        <div className="grid lg:grid-cols-2 items-start gap-16 lg:gap-20">

          {/* LEFT SIDE - Content */}
          <div className="w-full lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 space-y-10">
            <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink-soft border border-dashed border-ink/25 px-4 py-2 rounded">
              <Sparkles size={14} className="text-redpen" />
              Welcome to CampusHub
            </span>

            <div className="space-y-5">
              <h1 className="font-display font-bold text-ink text-4xl lg:text-5xl leading-[1.05]">
                One account.<br />Every branch, every doubt.
              </h1>
              <p className="font-body text-ink-soft text-lg leading-relaxed max-w-md">
                Connect with students across branches. Share notes and PYQs,
                get doubts answered, and stay updated on college notices.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
              {features.map((feature, index) => (
                <div key={index} className="bg-paper p-6 hover:bg-white transition-colors">
                  <feature.icon size={20} className="text-ink/50 mb-4" strokeWidth={2} />
                  <h3 className="font-display font-bold text-ink text-base mb-1.5">{feature.title}</h3>
                  <p className="font-body text-ink-soft text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - Form */}
          <div className="w-full lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0">
            <div className="bg-white border border-ink/10 rounded-sm shadow-[0_20px_50px_-15px_rgba(22,33,58,0.15)] p-8 lg:p-10">

              {error && (
                <div className="mb-6 p-4 bg-redpen/5 border border-redpen/30 rounded flex items-center gap-3">
                  <AlertCircle size={18} className="text-redpen shrink-0" />
                  <span className="font-body text-sm text-redpen">{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-highlighter/10 border border-highlighter/60 rounded flex items-center gap-3">
                  <svg className="w-4 h-4 text-ink shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-body text-sm text-ink">{success}</span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto bg-ink rounded flex items-center justify-center mb-5">
                  <BookOpen size={24} className="text-paper" strokeWidth={2} />
                </div>
                <h2 className="font-display font-bold text-ink text-2xl lg:text-3xl">
                  {isLogin ? 'Welcome back' : 'Join CampusHub'}
                </h2>
                <p className="font-body text-ink-soft mt-2">
                  {isLogin ? 'Log in to your account' : 'Create your student account'}
                </p>
              </div>

              <div className="flex border border-ink/15 rounded p-1 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 rounded font-body font-semibold text-sm transition-colors ${
                    isLogin ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 rounded font-body font-semibold text-sm transition-colors ${
                    !isLogin ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink-soft">
                      <Image size={14} />
                      Profile avatar
                    </label>
                    <div className="relative w-full h-28 bg-paper border-2 border-dashed border-ink/25 rounded flex items-center justify-center overflow-hidden hover:border-redpen/50 transition-colors">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center px-4">
                          <Upload size={22} className="mx-auto text-ink-soft mb-1.5" />
                          <p className="font-body text-sm text-ink-soft">JPG or PNG, max 5MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    {formData.avatar && (
                      <p className="font-mono text-xs text-ink-soft">{formData.avatar.name}</p>
                    )}
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink-soft">
                      <User size={14} />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink transition-colors"
                      placeholder="@yourusername"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink-soft">
                    <User size={14} />
                    {isLogin ? 'Email address' : 'Full name'}
                  </label>
                  <input
                    type={isLogin ? 'email' : 'text'}
                    name={isLogin ? 'email' : 'fullname'}
                    value={isLogin ? formData.email : formData.fullname}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink transition-colors"
                    placeholder={isLogin ? 'student@college.edu' : 'John Doe'}
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink-soft">
                      <Mail size={14} />
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink transition-colors"
                      placeholder="student@college.edu"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink-soft">
                        <GraduationCap size={14} />
                        Branch
                      </label>
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink transition-colors"
                      >
                        <option value="">Select branch</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics & Comm.</option>
                        <option value="ME">Mechanical</option>
                        <option value="CE">Civil</option>
                        <option value="EE">Electrical</option>
                        <option value="IT">Information Tech</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink-soft">
                        <BookOpen size={14} />
                        Semester
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink transition-colors"
                      >
                        <option value="">Select semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink-soft">
                    <Lock size={14} />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pr-11 bg-paper border border-ink/15 rounded font-body text-ink focus:outline-none focus:border-ink transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 bg-ink text-paper rounded font-body font-semibold flex items-center justify-center gap-2 hover:bg-redpen transition-colors ${
                    isLoading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {isLogin ? 'Sign in to CampusHub' : 'Create my account'}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-dashed border-ink/20">
                <p className="text-center font-mono text-xs tracking-widest uppercase text-ink-soft mb-4">
                  Or continue with
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `${API_BASE_URL}/auth/google`;
                    }}
                    className="py-3 border border-ink/15 rounded font-body font-medium text-sm text-ink hover:border-ink transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="py-3 border border-ink/15 rounded font-body font-medium text-sm text-ink hover:border-ink transition-colors flex items-center justify-center gap-2"
                  >
                    College SSO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}