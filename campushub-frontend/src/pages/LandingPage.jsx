import { ArrowRight, Users, BookOpen, MessageCircle, Calendar, GraduationCap, Zap, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-x-hidden">
      {/* 🎯 HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-500/5 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Headline */}
          <div className="inline-block">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-full shadow-lg mb-8 animate-pulse">
              🚀 For Distance & College Students
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-8">
              Campus<span className="text-indigo-600">Hub</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-light max-w-4xl mx-auto leading-relaxed mb-12">
              Share notes, PYQs, get exam & placement advice. Never miss college notifications, 
              internships or events again. Your <span className="font-bold text-indigo-600">complete campus companion</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button
             onClick={() => navigate("/auth")}   
             className="group bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-12 py-6 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-500 flex items-center gap-3">
              🚀 Start Free Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-3 px-12 py-6 border-2 border-gray-200 rounded-3xl text-xl font-bold hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-500"
            >
              📱 Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-600 mb-1">10K+</div>
              <div className="text-sm text-gray-600 font-semibold">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-600 mb-1">5K+</div>
              <div className="text-sm text-gray-600 font-semibold">Resources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-600 mb-1">500+</div>
              <div className="text-sm text-gray-600 font-semibold">Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-orange-600 mb-1">95%</div>
              <div className="text-sm text-gray-600 font-semibold">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎓 PROBLEMS SOLVED */}
      <section className="py-24 px-6 md:px-12 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              Problems We Solve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Distance students struggle alone. CampusHub changes that.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Problem Cards */}
            <div className="group bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-3xl border border-red-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-all">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">📚 No Notes Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Distance students miss handwritten notes, PYQs, and study materials from college.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl border border-yellow-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-all">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💬 No Peer Support</h3>
              <p className="text-gray-600 leading-relaxed">
                No one to ask exam doubts, placement tips, or branch-specific advice.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl border border-emerald-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-all">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">📅 Miss Notifications</h3>
              <p className="text-gray-600 leading-relaxed">
                College events, internships, exams, results - all missed notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 FEATURES */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-white/70 to-indigo-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              One platform for all your college needs. AI-powered features coming soon!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-all">
                <GraduationCap className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">📝 Notes & PYQs</h3>
              <p className="text-gray-600">Share and download branch-wise notes, previous year questions</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-all">
                <Users className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">💬 Branch Discussions</h3>
              <p className="text-gray-600">CSE, ECE, Mech - get advice from same branch students</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-all">
                <Zap className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Placement Prep</h3>
              <p className="text-gray-600">Mock interviews, company updates, placement experiences</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-all">
                <Shield className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🔔 Campus Alerts</h3>
              <p className="text-gray-600">Exams, events, internships - never miss important updates</p>
            </div>
          </div>

          {/* AI Teaser */}
          <div className="mt-24 p-12 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-4xl text-white text-center shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">🤖 AI Features Coming Soon</h3>
            <p className="text-xl mb-8 opacity-90">Note summarization, instant doubt solving, personalized study plans</p>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-3xl text-lg font-semibold hover:bg-white/30 transition-all">
              Powered by Gemini AI
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* 🎉 FINAL CTA */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center bg-white/70 backdrop-blur-xl rounded-4xl p-16 shadow-2xl border border-white/50">
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Ready to Ace Your College Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join 10K+ students already sharing notes, cracking placements, and staying ahead.
          </p>
          <button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-16 py-6 rounded-3xl text-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 flex items-center gap-4 mx-auto">
            🚀 Join CampusHub Free
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900">📱 Live Demo</h3>
                <button 
                  onClick={() => setShowDemo(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              {/* Embed your dashboard screenshot or iframe */}
              <img 
                src="/dashboard-demo.png" 
                alt="CampusHub Dashboard" 
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}