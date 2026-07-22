import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  FiMessageSquare,
  FiSend,
  FiUser,
  FiInbox,
  FiActivity,
  FiChevronsRight,
} from "react-icons/fi";

export default function AdvisoryPage() {
  const { user } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/api/messages/contacts");
      setContacts(response.data.data.contacts || []);
    } catch (err) {
      toast.error("Unable to load contacts.");
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchThread = async (contactId) => {
    setLoadingThread(true);
    try {
      const response = await api.get(`/api/messages/thread/${contactId}`);
      setMessages(response.data.data.thread || []);
    } catch (err) {
      toast.error("Unable to load chat history.");
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchThread(activeContact._id || activeContact.id);
    }
  }, [activeContact]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeContact) return;
    setSending(true);
    try {
      const contactId = activeContact._id || activeContact.id;
      const response = await api.post("/api/messages", {
        recipientId: contactId,
        content: input,
      });
      setMessages((prev) => [...prev, response.data.data.message]);
      setInput("");
    } catch (err) {
      // Intercepted
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isAdvisor = user?.role === "advisor";

  const presetAdviceList = [
    "💡 Advisory Note: Recommend allocating 60% into Nifty 50 Index and 40% into Gold ETFs for balanced growth.",
    "🛡️ Advisory Note: Based on your Conservative risk profile, consider increasing debt fund allocation.",
    "🎯 Advisory Note: Great progress on your goal! Advise setting up an automated 2x Round-Up multiplier.",
    "⚡ Advisory Note: Consider setting aside ₹2,000 in your Sikka Wallet as an emergency liquidity reserve.",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-900 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <FiMessageSquare className={isAdvisor ? "text-emerald-400" : "text-brand-500"} />
            {isAdvisor ? "Client Advisory Consult Terminal" : "Peer Advisory Room"}
          </h2>
          <p className="text-slate-400 text-sm">
            {isAdvisor
              ? "Review assigned investor profiles and issue SEBI-compliant wealth advice."
              : "Connect with certified Sikka financial advisors for custom planning."}
          </p>
        </div>
        {isAdvisor && (
          <span className="self-start md:self-auto text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Certified Advisor Mode
          </span>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-grow flex border border-slate-900 rounded-3xl bg-slate-950/20 overflow-hidden min-h-[450px]">
        {/* Sidebar Contacts List */}
        <div className="w-80 border-r border-slate-900 bg-slate-950/60 flex flex-col">
          <div className="p-4 border-b border-slate-900 bg-slate-950/80 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAdvisor ? "Assigned Investor Clients" : "Certified Advisors"}
            </span>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-900 px-2 py-0.5 rounded">
              {contacts.length}
            </span>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-slate-900/60">
            {loadingContacts ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Loading contact registry...
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                <FiInbox className="w-6 h-6 mx-auto text-slate-700 mb-2" />
                <p>No active contacts available.</p>
              </div>
            ) : (
              contacts.map((contact) => {
                const isSelected = activeContact?.id === contact.id || activeContact?._id === contact._id;
                return (
                  <button
                    key={contact._id || contact.id}
                    onClick={() => setActiveContact(contact)}
                    className={`w-full p-4 text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? isAdvisor
                          ? "bg-emerald-500/10 border-l-4 border-l-emerald-500"
                          : "bg-brand-500/10 border-l-4 border-l-brand-500"
                        : "hover:bg-slate-900/40"
                    }`}
                  >
                    <div className={`p-2 border rounded-xl text-sm shrink-0 ${
                      isAdvisor ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}>
                      <FiUser />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="font-bold text-slate-200 text-sm truncate">{contact.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        contact.role === "investor"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-brand-400 bg-brand-500/10 border-brand-500/20"
                      }`}>
                        {contact.role}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Thread Area */}
        <div className="flex-grow flex flex-col justify-between bg-slate-950/20">
          {activeContact ? (
            <>
              {/* Active Header */}
              <div className="p-4 border-b border-slate-900 bg-slate-950/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 border rounded-xl text-xs ${
                    isAdvisor ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-brand-400"
                  }`}>
                    <FiUser />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      {activeContact.name}
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded uppercase">
                        {activeContact.role}
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">{activeContact.email}</p>
                  </div>
                </div>
                {isAdvisor && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Active Advisory Channel
                  </span>
                )}
              </div>

              {/* Messages feed */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 max-h-[500px]">
                {loadingThread ? (
                  <div className="text-center text-xs text-slate-500 py-10">
                    Loading conversation thread...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-600 py-10 space-y-1">
                    <p>No messages in this chat room yet.</p>
                    <p>{isAdvisor ? "Type a financial recommendation below for your client." : "Type a note below to start the conversation."}</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isOutgoing = msg.senderId.toString() === user.id.toString();
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 max-w-[75%] ${
                          isOutgoing ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isOutgoing
                                ? isAdvisor
                                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10"
                                  : "bg-brand-650 text-white"
                                : "bg-slate-900 border border-slate-850 text-slate-200"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[8px] text-slate-600 font-mono text-right pr-2">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={scrollRef} />
              </div>

              {/* One-Tap Advisory Recommendation Presets for Advisors */}
              {isAdvisor && (
                <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-900/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                    Quick Advice:
                  </span>
                  {presetAdviceList.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(preset)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 rounded-lg text-[10px] whitespace-nowrap transition-all shrink-0"
                    >
                      {preset.split(":")[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-900 bg-slate-950/40 flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isAdvisor ? "Write financial advice or recommendation..." : "Type message..."}
                  className={`flex-grow px-4 py-2.5 bg-slate-900 border border-slate-800 placeholder-slate-650 text-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 ${
                    isAdvisor ? "focus:ring-emerald-500" : "focus:ring-brand-500"
                  }`}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className={`px-4 py-2.5 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 ${
                    isAdvisor ? "bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20" : "bg-brand-600 hover:bg-brand-500"
                  }`}
                >
                  <span>Send</span>
                  <FiSend />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center flex-col text-slate-500 p-8 space-y-2">
              <FiMessageSquare className="w-10 h-10 text-slate-700" />
              <h4 className="font-bold text-slate-400">
                {isAdvisor ? "Select an Investor Client" : "No Chat Selected"}
              </h4>
              <p className="text-xs text-slate-600 max-w-xs text-center leading-relaxed">
                {isAdvisor
                  ? "Select an assigned investor client from the left directory to inspect chat history and issue wealth advice."
                  : "Please select a certified advisor from the left sidebar panel to begin communication."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
