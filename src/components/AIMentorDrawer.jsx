// Version: v1.0 - AI Mentor Drawer with Full Phase 2 Chat State Management
import { useState, useRef, useEffect } from 'react';

export default function AIMentorDrawer({ isOpen, onClose }) {
  // --- Phase 2 State Management: Issue #12 ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'mentor',
      text: "I am your Al Brooks Price Action Mentor. Ask me about bar types, market states, or trade setups. Remember: context always supersedes the appearance of a single bar.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever a new message is logged
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle message dispatch and mentor response simulation
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    // Simulated Price Action Mentor response loop (Pre-wiring for Phase 3 RAG integration)
    setTimeout(() => {
      const mentorReply = generateMentorResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'mentor',
          text: mentorReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsThinking(false);
    }, 600);
  };

  // Quick heuristic response generator based on Al Brooks' principles
  const generateMentorResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('always in') || q.includes('ail') || q.includes('ais')) {
      return "Always In Long (AIL) or Always In Short (AIS) requires looking at the dominant trend. If you were forced to enter right now and hold for 10 bars, which side has a greater than 60% chance of a scalp? Enter in that direction and swing.";
    }
    if (q.includes('breakout') || q.includes('80%')) {
      return "In a trading range, 80% of breakout attempts fail. Expect institutional limit order traders to fade breakouts above resistance and below support. Look for failed breakouts (traps) rather than chasing momentum.";
    }
    if (q.includes('doji') || q.includes('equilibrium')) {
      return "A doji represents a 50/50 balance between bulls and bears. Never buy or sell a doji in the middle of a trading range with stop orders; it offers no edge until a clear signal bar forms.";
    }
    return `Looking at "${query}" from a Price Action perspective: identify the market state first. Are we in a strong spike, a grinding channel, or a two-sided trading range? Context governs everything.`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Panel */}
      <aside className="w-full max-w-md h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">Al Brooks AI Mentor</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-1.5 rounded-lg transition-colors text-xs font-mono"
            aria-label="Close mentor drawer"
          >
            ✕ Close
          </button>
        </div>

        {/* Chat History Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  {msg.sender === 'user' ? 'You' : 'Brooks Mentor'}
                </span>
                <span className="text-[10px] font-mono text-slate-600">{msg.time}</span>
              </div>
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex flex-col items-start">
              <div className="bg-slate-900 border border-slate-800 text-slate-400 text-xs p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-[11px] font-mono text-slate-500">Analyzing bar context...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-blue-500 transition-colors">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about setups, bars, or Brooks rules..."
              className="flex-1 bg-transparent text-slate-100 text-xs md:text-sm focus:outline-none placeholder-slate-500 py-1.5"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-lg text-xs font-semibold font-mono transition-colors shrink-0"
            >
              Send ➔
            </button>
          </div>
        </form>

      </aside>
    </div>
  );
}
