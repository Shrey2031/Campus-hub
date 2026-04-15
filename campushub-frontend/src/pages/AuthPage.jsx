
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, User, GraduationCap, BookOpen, Lock,
   Users, FileText, MessageCircle, Megaphone, ArrowRight, 
   Sparkles, Image, Upload, Loader2, AlertCircle } from 'lucide-react';
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
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // API Configuration
  const API_BASE_URL = 'http://localhost:5000/api/v1/users'; // Change to your backend URL
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests if available
  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const features = [
    {
      icon: FileText,
      title: "Share Notes & PYQs",
      desc: "Upload and access previous year questions, lecture notes, and study materials across all branches"
    },
    {
      icon: MessageCircle,
      title: "Branch-wise Discussions",
      desc: "Connect with students from your branch and semester for doubt clearing and discussions"
    },
    {
      icon: Megaphone,
      title: "College Notifications",
      desc: "Stay updated with all college announcements, exam schedules, and important updates"
    },
    {
      icon: Users,
      title: "Student Community",
      desc: "Network with students from every branch and build your college connections"
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
   

  // LOGIN API CALL
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.post('/login', {
        email: formData.email,
        password: formData.password
      });

      const token = response.data.data.accessToken;  // ← data.data.accessToken!
    const userData = response.data.data.user;

     console.log('🔑 TOKEN BEFORE STORAGE:', token ? 'FOUND' : 'MISSING'); // Debug 2
      // Store token and user data
      safeStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // safeStorage.setItem('token', token);
       // ✅ Test token immediately
    // console.log('🧪 LOCALSTORAGE TOKEN:', localStorage.getItem('token') ? 'OK' : 'MISSING');
    //     console.log('💾 AFTER STORAGE:', {
    //   tokenExists: !!localStorage.getItem('token'),
    //   tokenPreview: localStorage.getItem('token')?.slice(0, 20)

    // }); // Debug 3
     
    // ✅ CRITICAL DEBUG
    setTimeout(() => {
      console.log('🔍 2s LATER - localStorage token:', safeStorage.getItem('token'));
    }, 2000);

    navigate('/home');
      // Redirect or update app state
      console.log('Login Success:', response.data);
      setSuccess('Login successful! Redirecting...');
      
      
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // SIGNUP API CALL with FormData for avatar
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Create FormData for file upload
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

      console.log('Signup Success:', response.data);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Auto switch to login and prefill email
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-20 lg:py-32 max-w-7xl">
        <div className="grid lg:grid-cols-2 items-center gap-16 lg:gap-24">
          
          {/* LEFT SIDE - Content */}
          <div className="w-full lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 space-y-12">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-3xl text-white font-bold text-lg shadow-2xl mb-8 border border-white/20 inline-block">
                <Sparkles className="w-5 h-5 mr-2" />
                Welcome to CampusHub ✨
              </div>
            </div>
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 bg-clip-text text-transparent leading-tight">
                Your Ultimate
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">College Hub</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg">Connect with students across all branches. Share notes, PYQs, discuss doubts, and stay updated with college notifications.</p>
            </div>
            {/* Features and Stats - Same as before */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              {/* Features grid code here - same as previous */}
               {features.map((feature, index) => (
                <div key={index} className="group bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-indigo-200/50 cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
              
               {/* Stats - Bottom Aligned */}
            <div className="grid md:grid-cols-4 gap-6 pt-12 border-t border-indigo-100/50 pb-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">50K+</div>
                <div className="text-sm lg:text-base text-gray-600 font-semibold mt-2">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">200+</div>
                <div className="text-sm lg:text-base text-gray-600 font-semibold mt-2">Colleges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                <div className="text-sm lg:text-base text-gray-600 font-semibold mt-2">Notes Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">99%</div>
                <div className="text-sm lg:text-base text-gray-600 font-semibold mt-2">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Form */}
          <div className="w-full lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0">
            <div className="bg-white/95 backdrop-blur-3xl border border-white/70 rounded-3xl shadow-2xl p-12 lg:p-16 relative overflow-hidden">
              
              {/* Error/Success Messages */}
              {error && (
                <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-4">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <span className="text-red-700 font-semibold">{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-4">
                  <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-emerald-700 font-semibold">{success}</span>
                </div>
              )}

              {/* Form Title & Toggle - Same as before */}
              <div className="text-center mb-12">
                {/* Logo & Title code here */}
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl flex items-center justify-center shadow-2xl p-6 mx-auto mb-8">
                  <svg className="w-14 h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
                  </svg>
                  </div>
                     <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mt-6">
                  {isLogin ? 'Welcome Back' : 'Join CampusHub'}
                </h2>
                <p className="text-gray-600 mt-4 text-lg lg:text-xl font-semibold">{isLogin ? 'Login to your account' : 'Create your student account'}</p>
              </div>
            
                {/* Toggle buttons code here */}
                   {/* Toggle Buttons */}
              <div className="flex bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-1 mb-12 shadow-inner">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-6 px-10 rounded-xl font-bold text-xl transition-all duration-300 ${
                    isLogin
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-6 px-10 rounded-xl font-bold text-xl transition-all duration-300 ${
                    !isLogin
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Upload Field - Only Signup */}
                {!isLogin && (
                  <div className="space-y-4">
                    <label className="block text-base font-bold text-gray-800 flex items-center">
                      <Image className="w-6 h-6 mr-3 text-indigo-600" />
                      Profile Avatar
                    </label>
                    <div className="relative">
                                            <div className="w-full h-32 lg:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl border-4 border-dashed border-indigo-200/50 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden">
                        {avatarPreview ? (
                          <img 
                            src={avatarPreview} 
                            alt="Avatar Preview"
                            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-center space-y-3 p-8">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                              <Upload className="w-10 h-10 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-xl text-gray-700 mb-1">Upload Profile Photo</p>
                              <p className="text-sm text-gray-500">JPG, PNG (Max 5MB)</p>
                            </div>
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
                        <p className="text-sm text-emerald-600 mt-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {formData.avatar.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Rest of form fields - Username, Email, Branch, Semester, Password */}
                {!isLogin && (
                  <div className="space-y-4">
                    <label className="block text-base font-bold text-gray-800 flex items-center">
                      <User className="w-6 h-6 mr-3 text-indigo-600" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full px-8 py-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 shadow-2xl hover:shadow-3xl transition-all duration-300 placeholder-gray-500 h-20"
                      placeholder="@yourusername"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-base font-bold text-gray-800 flex items-center">
                    <User className="w-6 h-6 mr-3 text-indigo-600" />
                    {isLogin ? 'Email Address' : 'Full Name'}
                  </label>
                  <input
                    type={isLogin ? 'email' : 'text'}
                    name={isLogin ? 'email' : 'fullname'}
                    value={isLogin ? formData.email : formData.fullname}
                    onChange={handleInputChange}
                    required
                    className="w-full px-8 py-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 shadow-2xl hover:shadow-3xl transition-all duration-300 placeholder-gray-500 h-20"
                    placeholder={isLogin ? 'student@college.edu' : 'John Doe'}
                  />
                </div>
                
                {!isLogin && (
  <div className="space-y-4">
    <label className="block text-base font-bold text-gray-800 flex items-center">
      <Mail className="w-6 h-6 mr-3 text-indigo-600" />
      Email Address
    </label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleInputChange}
      required
      className="w-full px-8 py-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl text-xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 shadow-2xl hover:shadow-3xl transition-all duration-300 placeholder-gray-500 h-20"
      placeholder="student@college.edu"
    />
  </div>
)}
                {!isLogin && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-base font-bold text-gray-800 flex items-center">
                        <GraduationCap className="w-6 h-6 mr-3 text-indigo-600" />
                        Branch
                      </label>
                      <select name="branch" value={formData.branch} onChange={handleInputChange} required className="w-full px-8 py-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 shadow-2xl hover:shadow-3xl transition-all duration-300 h-20">
                        <option value="">Select your branch</option>
                        <option value="CSE">Computer Science Engineering</option>
                        <option value="ECE">Electronics & Communication</option>
                        <option value="ME">Mechanical Engineering</option>
                        <option value="CE">Civil Engineering</option>
                        <option value="EE">Electrical Engineering</option>
                        <option value="IT">Information Technology</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-bold text-gray-800 flex items-center">
                        <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
                        Semester
                      </label>
                      <select name="semester" value={formData.semester} onChange={handleInputChange} required className="w-full px-8 py-6 bg-white/80 backdrop-blur-sm                       border border-gray-200/50 rounded-3xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 shadow-2xl hover:shadow-3xl transition-all duration-300 h-20">
                        <option value="">Select semester</option>
                        <option value="1">1st Semester</option>
                        <option value="2">2nd Semester</option>
                        <option value="3">3rd Semester</option>
                        <option value="4">4th Semester</option>
                        <option value="5">5th Semester</option>
                        <option value="6">6th Semester</option>
                        <option value="7">7th Semester</option>
                        <option value="8">8th Semester</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-base font-bold text-gray-800 flex items-center">
                    <Lock className="w-6 h-6 mr-3 text-indigo-600" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-8 py-6 pr-20 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 shadow-2xl hover:shadow-3xl transition-all duration-300 placeholder-gray-500 h-20"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-all p-3"
                    >
                      {showPassword ? <EyeOff className="w-7 h-7" /> : <Eye className="w-7 h-7" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button with Loading */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-8 px-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl text-white font-black text-lg lg:text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 transform h-24 flex items-center justify-center space-x-4 group ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to CampusHub' : 'Create My Account'}</span>
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-16 pt-12 border-t border-indigo-100/50">
                <p className="text-center text-gray-600 mb-8 font-bold text-lg">Or continue with</p>
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    type="button"
                    onClick={async () => {
                      // Google OAuth integration
                      window.location.href = `${API_BASE_URL}/auth/google`;
                    }}
                    className="py-6 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-3xl text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 h-20"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button className="py-6 px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-3xl text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 h-20">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                    <span>College SSO</span>
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