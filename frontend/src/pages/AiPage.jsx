import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  FiSend,
  FiCpu,
  FiUser,
  FiMessageSquare,
  FiTrendingUp,
  FiTarget,
  FiHelpCircle,
} from "react-icons/fi";

const suggestionChips = [
  { text: "What portfolio fits my risk profile?", icon: <FiTrendingUp /> },
  { text: "How are my active goals doing?", icon: <FiTarget /> },
  { text: "How do micro-investing round-ups work?", icon: <FiHelpCircle /> },
];

export default function AiPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am Sikka AI, your micro-investment advisor. I can help analyze your risk metrics, track active goals, and review wallet allocations. What would you like to plan today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text: textToSend, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/api/ai/chat", { message: textToSend });
      // Extract from unified envelope data: { reply }
      const aiReply = response.data.data.reply;
      
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiReply, time: new Date() },
      ]);
    } catch (err) {
      toast.error("Unable to connect with Sikka AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-140px)] flex flex-col justify-between gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <FiCpu className="text-brand-500 animate-pulse" />
            Sikka AI Financial Assistant
          </h2>
          <p className="text-xs text-slate-400">
            Real-time advisory trained on your wallet details, portfolios, and goals.
          </p>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-grow overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-900">
        {messages.map((msg, idx) => {
          const isAi = msg.sender === "ai";
          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 max-w-[85%] ${
                isAi ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`p-2 rounded-xl text-sm shrink-0 border ${
                  isAi
                    ? "bg-brand-500/10 border-brand-500/20 text-brand-400"
                    : "bg-slate-900 border-slate-800 text-slate-300"
                }`}
              >
                {isAi ? <FiCpu /> : <FiUser />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div
                  className={`p-4 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap ${
                    isAi
                      ? "bg-slate-950/80 border-slate-900 text-slate-200"
                      : "bg-brand-650 hover:bg-brand-600 border-transparent text-white shadow-md shadow-brand-900/10"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-[9px] text-slate-500 font-mono text-right pr-2">
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing loading state */}
        {loading && (
          <div className="flex items-center gap-3.5 mr-auto max-w-[85%]">
            <div className="p-2 rounded-xl border bg-brand-500/10 border-brand-500/20 text-brand-400 shrink-0">
              <FiCpu className="animate-spin" />
            </div>
            <div className="p-4 rounded-2xl border bg-slate-950/80 border-slate-900 flex items-center gap-1.5 py-3">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggestion Chips and Send Form Area */}
      <div className="space-y-4 pt-4 border-t border-slate-900">
        {/* Suggestion chips */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2.5">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.text)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-900 hover:border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-xs font-medium text-slate-300 hover:text-white transition-all duration-300"
              >
                {chip.icon}
                <span>{chip.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Message Input Box Form */}
        <div className="flex gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Sikka AI about goals, risk appetites, round-ups..."
            className="flex-grow px-4 py-3 bg-slate-900 border border-slate-800 placeholder-slate-600 text-slate-200 text-sm rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent transition-all resize-none max-h-24 scrollbar-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center shrink-0 self-end shadow-md shadow-brand-900/10"
            title="Send Message"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
