// // // src/pages/AuthPage.jsx
// // import { useState } from 'react';
// // import { useAuth } from '../contexts/AuthContext';
// // import { useNavigate } from 'react-router-dom';

// // export default function AuthPage() {
// //   const [isLogin, setIsLogin] = useState(false);
// //   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
// //   const [loading, setLoading] = useState(false);
// //   const { login, signup } = useAuth();
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
    
// //     try {
// //       if (isLogin) {
// //         await login(formData.email, formData.password);
// //       } else {
// //         await signup(formData.email, formData.password, formData.name);
// //       }
// //       navigate('/dashboard');
// //     } catch (error) {
// //       console.error('Auth error:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
// //       <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
// //         {/* Header */}
// //         <div className="text-center mb-10">
// //           <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
// //             Welcome Back
// //           </h1>
// //           <p className="text-gray-600 text-lg">{isLogin ? 'Sign in to your account' : 'Join CampusHub today'}</p>
// //         </div>

// //         {/* Form */}
// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           {!isLogin && (
// //             <div>
// //               <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
// //               <input
// //                 type="text"
// //                 required
// //                 placeholder="John Doe"
// //                 value={formData.name}
// //                 onChange={(e) => setFormData({...formData, name: e.target.value})}
// //                 className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
// //               />
// //             </div>
// //           )}
          
// //           <div>
// //             <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
// //             <input
// //               type="email"
// //               required
// //               placeholder="student@college.com"
// //               value={formData.email}
// //               onChange={(e) => setFormData({...formData, email: e.target.value})}
// //               className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
// //             />
// //           </div>
          
// //           <div>
// //             <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
// //             <input
// //               type="password"
// //               required
// //               placeholder="••••••••"
// //               value={formData.password}
// //               onChange={(e) => setFormData({...formData, password: e.target.value})}
// //               className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
// //           >
// //             {loading ? '⏳ Creating Account...' : (isLogin ? '🚀 Sign In' : '🚀 Create Account')}
// //           </button>
// //         </form>

// //         {/* Toggle */}
// //         <div className="text-center mt-8 pt-8 border-t border-gray-200">
// //           <p className="text-sm text-gray-600">
// //             {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
// //             <button
// //               type="button"
// //               onClick={() => setIsLogin(!isLogin)}
// //               className="font-bold text-indigo-600 hover:text-indigo-700"
// //             >
// //               {isLogin ? 'Sign Up' : 'Sign In'}
// //             </button>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // src/pages/AuthPage.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function AuthPage({ onLogin }) {
//   const [isLogin, setIsLogin] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     setTimeout(() => {
//       onLogin(formData.email, formData.password, formData.name);
//       navigate('/dashboard');
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-[70vh] flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border">
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
//             {isLogin ? 'Welcome Back' : 'Join CampusHub'}
//           </h1>
//           <p className="text-gray-600">{isLogin ? 'Sign in to continue' : 'Create your account'}</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {!isLogin && (
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           )}
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50"
//           >
//             {loading ? '⏳ Creating Account...' : (isLogin ? '🚀 Sign In' : '🚀 Sign Up')}
//           </button>
//         </form>

//         <p className="text-center mt-8 text-sm text-gray-600 border-t pt-6">
//           {isLogin ? "New here?" : "Have account?"}{' '}
//           <button
//             type="button"
//             onClick={() => setIsLogin(!isLogin)}
//             className="font-bold text-indigo-600 hover:underline"
//           >
//             {isLogin ? 'Create Account' : 'Sign In'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }


// src/pages/AuthPage.jsx - COMPLETE LOGIN/SIGNUP
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, User, ArrowRight, GraduationCap, Users, BookOpen, Zap, Shield, Calendar 
} from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    showPassword: false 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (onLogin) {
        onLogin(formData.email, formData.password, formData.name);
        navigate('/dashboard');
      }
      setIsLoading(false);
    }, 2000);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', showPassword: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center">
        
        {/* Left Side - Illustration */}
        <div className="hidden lg:block w-1/2 max-w-md">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl -z-10"></div>
            
            {/* Illustration Cards */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl mx-auto">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">📚 Notes & PYQs</h3>
                <p className="text-gray-600 text-sm text-center">Share study materials instantly</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">💬 Campus Chat</h3>
                <p className="text-gray-600 text-sm text-center">Connect with your batchmates</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">🎯 Placement Prep</h3>
                <p className="text-gray-600 text-sm text-center">Ace your interviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-4xl shadow-2xl p-10 border border-white/50">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 leading-tight">
                {isLogin ? 'Welcome Back' : 'Join CampusHub'}
              </h1>
              <p className="text-xl text-gray-600 font-light">
                {isLogin 
                  ? 'Sign in to access your dashboard' 
                  : 'Create account to start sharing notes & connecting with students'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Field - Only for Signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-5 pl-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md text-lg"
                    required
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-5 pl-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md text-lg"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    placeholder="Create strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-5 pl-12 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm hover:shadow-md text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {formData.showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white py-6 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-lg"
              >
                {isLoading ? (
                  <>
                    ⏳ {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? '🚀 Sign In' : '🚀 Create Account'}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-semibold">or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-3 mb-10">
              <button className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-lg transition-all hover:bg-indigo-50">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  </svg>
                </div>
                Continue with Google
              </button>
            </div>

            {/* Toggle Form */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-lg text-gray-700">
                {isLogin 
                  ? "Don't have an account?" 
                  : "Already have an account?"
                }
                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-2 font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-all"
                >
                  {isLogin ? 'Create One' : 'Sign In'}
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-4">
                🔒 Your data is secure with us. Privacy guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}