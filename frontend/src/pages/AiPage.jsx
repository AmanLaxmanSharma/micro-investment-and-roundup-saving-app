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
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#123B5D] flex items-center gap-3 font-outfit">
            <FiCpu className="text-[#16A36A] animate-pulse" />
            Sikka AI Financial Assistant
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time advisory trained on your wallet details, portfolios, and goals.
          </p>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-grow overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
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
                    ? "bg-[#DCFCE7] border-[#BBF7D0] text-[#123B5D]"
                    : "bg-[#123B5D] border-[#0D2A42] text-white"
                }`}
              >
                {isAi ? <FiCpu className="text-[#16A36A]" /> : <FiUser />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div
                  className={`p-4 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap ${
                    isAi
                      ? "bg-white border-[#E2E8F0] text-[#1F2937] shadow-sm"
                      : "bg-[#16A36A] hover:bg-[#138959] border-transparent text-white shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-[9px] text-[#94A3B8] font-mono text-right pr-2">
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
            <div className="p-2 rounded-xl border bg-[#DCFCE7] border-[#BBF7D0] text-[#123B5D] shrink-0">
              <FiCpu className="animate-spin text-[#16A36A]" />
            </div>
            <div className="p-4 rounded-2xl border bg-white border-[#E2E8F0] flex items-center gap-1.5 py-3 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#16A36A] rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-[#16A36A] rounded-full animate-bounce delay-200" />
              <span className="w-1.5 h-1.5 bg-[#16A36A] rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggestion Chips and Send Form Area */}
      <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
        {/* Suggestion chips */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2.5">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.text)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E2E8F0] hover:border-[#16A36A] bg-white hover:bg-[#DCFCE7] text-xs font-semibold text-[#1F2937] transition-all shadow-2xs"
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
            className="flex-grow px-4 py-3 bg-white border border-[#E2E8F0] placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-2xl focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all resize-none max-h-24 shadow-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-3.5 bg-[#16A36A] hover:bg-[#138959] text-white rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center shrink-0 self-end shadow-sm"
            title="Send Message"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
