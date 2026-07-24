import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Bot, Send, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const parseMessageParts = (text) => {
  const parts = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', lang: match[1], content: match[2].trim() });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts.length ? parts : [{ type: 'text', content: text }];
};

const CodeBlock = ({ lang, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="bg-ink rounded-sm overflow-hidden my-2">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-dashed border-paper/20">
        <span className="font-mono text-[10px] uppercase tracking-wide text-paper/50">{lang || 'code'}</span>
        <button onClick={handleCopy} className="text-paper/50 hover:text-paper transition-colors">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto">
        <code className="font-mono text-xs text-paper leading-relaxed">{content}</code>
      </pre>
    </div>
  );
};

const MessageContent = ({ text }) => (
  <>
    {parseMessageParts(text).map((part, i) =>
      part.type === 'code' ? (
        <CodeBlock key={i} lang={part.lang} content={part.content} />
      ) : (
        part.content.trim() && (
          <p key={i} className="font-body text-sm whitespace-pre-wrap leading-relaxed">
            {part.content.trim()}
          </p>
        )
      )
    )}
  </>
);

const AIChat = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

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
      const response = await axios.post(`${API_BASE_URL}/ai/ask`, { question: userQuestion });
      setChatHistory(prev => [...prev, { type: 'ai', text: response.data.answer }]);
    } catch (error) {
      console.error('AI error:', error.response?.data || error.message);
      setChatHistory(prev => [...prev, { type: 'error', text: 'AI service error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-paper">
      {/* Header */}
      <div className="bg-paper/95 backdrop-blur border-b-2 border-dashed border-ink/20 p-5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-ink/10 rounded hover:border-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-ink" />
          </button>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-ink rounded flex items-center justify-center">
              <Bot className="w-5 h-5 text-paper" />
            </span>
            <div>
              <h1 className="font-display font-bold text-ink text-xl">AI Assistant</h1>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                Powered by Gemini
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden max-w-4xl mx-auto w-full px-6 py-6">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
            {chatHistory.length === 0 ? (
              <div className="text-center py-20 text-ink-soft">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <h3 className="font-display font-bold text-ink text-lg mb-1">Ask anything</h3>
                <p className="font-body text-sm">Doubts, definitions, concepts — I'll explain, not just define.</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-xl p-3.5 rounded-sm ${
                    msg.type === 'user'
                      ? 'bg-ink text-paper'
                      : msg.type === 'ai'
                      ? 'bg-white border border-ink/10 text-ink'
                      : 'bg-redpen/5 border border-redpen/30 text-redpen'
                  }`}>
                    {msg.type === 'ai' ? (
                      <MessageContent text={msg.text} />
                    ) : (
                      <p className="font-body text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-ink/10 p-3.5 rounded-sm max-w-xs flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full animate-spin" />
                  <span className="font-mono text-xs text-ink-soft">AI is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white border border-ink/10 rounded-sm p-3">
            <div className="flex items-end gap-2.5">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 p-3 bg-paper border border-ink/15 rounded font-body text-sm focus:outline-none focus:border-ink"
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
                className="w-11 h-11 bg-ink text-paper rounded hover:bg-redpen transition-colors flex items-center justify-center disabled:opacity-40 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;