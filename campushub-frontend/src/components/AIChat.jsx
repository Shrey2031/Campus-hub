import  { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Bot, Send } from 'lucide-react';

const AIChat = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Update API URL for production
  
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);



const handleSubmit = async (e) => {
  e.preventDefault();
  if (!question.trim()) return;

  const userQuestion = question;
  setLoading(true);
  setChatHistory(prev => [...prev, { type: 'user', text: userQuestion }]);
  setQuestion('');

  try {
    // 🔥 HARDCODE WORKING URL - COPY THIS EXACTLY
    const response = await axios.post(`${API_BASE_URL}/ai/ask`, {
      question: userQuestion
    });
    
    console.log('✅ AI Response:', response.data);
    
    setChatHistory(prev => [...prev, { type: 'ai', text: response.data.answer }]);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    setChatHistory(prev => [...prev, { type: 'error', text: 'AI service error' }]);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center">
          <div className="p-2 rounded-2xl bg-indigo-100 mr-4 hover:bg-indigo-200 transition-all cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Assistant
              </h1>
              <p className="text-sm text-gray-600">Ask anything about campus, courses, events...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden max-w-4xl mx-auto w-full px-6 py-8">
        <div className="chat-container h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {chatHistory.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <h3 className="text-xl font-semibold mb-2">Welcome to AI Assistant!</h3>
                <p>Ask me anything about your campus life</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-lg ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                      : msg.type === 'ai'
                      ? 'bg-white border border-gray-200' 
                      : 'bg-red-100 border border-red-300 text-red-800'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    <span className="text-gray-600">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50">
            <div className="flex items-end space-x-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;