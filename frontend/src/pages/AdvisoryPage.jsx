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
      <div className="space-y-1 border-b border-[#E2E8F0] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#123B5D] flex items-center gap-3 font-outfit">
            <FiMessageSquare className="text-[#16A36A]" />
            {isAdvisor ? "Client Advisory Consult Terminal" : "Peer Advisory Room"}
          </h2>
          <p className="text-[#64748B] text-sm">
            {isAdvisor
              ? "Review assigned investor profiles and issue SEBI-compliant wealth advice."
              : "Connect with certified Sikka financial advisors for custom planning."}
          </p>
        </div>
        {isAdvisor && (
          <span className="self-start md:self-auto text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-[#DCFCE7] border border-[#16A36A]/30 text-[#123B5D] rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
            Certified Advisor Mode
          </span>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-grow flex border border-[#E2E8F0] rounded-3xl bg-white shadow-sm overflow-hidden min-h-[450px]">
        {/* Sidebar Contacts List */}
        <div className="w-80 border-r border-[#E2E8F0] bg-[#F5F7FA] flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] bg-white flex justify-between items-center">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              {isAdvisor ? "Assigned Investor Clients" : "Certified Advisors"}
            </span>
            <span className="text-[10px] font-mono text-[#123B5D] bg-[#DCFCE7] px-2 py-0.5 rounded font-bold border border-[#16A36A]/30">
              {contacts.length}
            </span>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-[#E2E8F0]">
            {loadingContacts ? (
              <div className="p-6 text-center text-xs text-[#64748B]">
                Loading contact registry...
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B] space-y-1">
                <FiInbox className="w-6 h-6 mx-auto text-[#94A3B8] mb-2" />
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
                        ? "bg-[#DCFCE7]/40 border-l-4 border-l-[#16A36A]"
                        : "hover:bg-white"
                    }`}
                  >
                    <div className={`p-2 border rounded-xl text-sm shrink-0 ${
                      isSelected ? "bg-white border-[#16A36A]/30 text-[#16A36A]" : "bg-slate-100 border-slate-200 text-[#64748B]"
                    }`}>
                      <FiUser />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="font-bold text-[#1F2937] text-sm truncate">{contact.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase text-[#123B5D] bg-[#DCFCE7] border-[#16A36A]/30">
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
        <div className="flex-grow flex flex-col justify-between bg-white">
          {activeContact ? (
            <>
              {/* Active Header */}
              <div className="p-4 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-[#16A36A]/30 rounded-xl text-xs bg-[#DCFCE7] text-[#16A36A]">
                    <FiUser />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#123B5D] text-sm flex items-center gap-2 font-outfit">
                      {activeContact.name}
                      <span className="text-[10px] font-bold text-[#123B5D] bg-[#DCFCE7] px-2 py-0.5 rounded uppercase border border-[#16A36A]/30">
                        {activeContact.role}
                      </span>
                    </h4>
                    <p className="text-[10px] text-[#64748B] font-mono">{activeContact.email}</p>
                  </div>
                </div>
                {isAdvisor && (
                  <span className="text-[10px] font-bold text-[#123B5D] bg-[#DCFCE7] px-2.5 py-1 rounded-full border border-[#16A36A]/30">
                    Active Advisory Channel
                  </span>
                )}
              </div>

              {/* Messages feed */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 max-h-[500px]">
                {loadingThread ? (
                  <div className="text-center text-xs text-[#64748B] py-10">
                    Loading conversation thread...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-[#64748B] py-10 space-y-1">
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
                                ? "bg-[#16A36A] text-white shadow-sm font-medium"
                                : "bg-[#F5F7FA] border border-[#E2E8F0] text-[#1F2937]"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[8px] text-[#94A3B8] font-mono text-right pr-2">
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
                <div className="px-4 py-2 bg-[#F5F7FA] border-t border-[#E2E8F0] flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider shrink-0">
                    Quick Advice:
                  </span>
                  {presetAdviceList.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(preset)}
                      className="px-2.5 py-1 bg-white hover:bg-[#DCFCE7] border border-[#E2E8F0] hover:border-[#16A36A] text-[#1F2937] hover:text-[#123B5D] rounded-lg text-[10px] whitespace-nowrap transition-all shrink-0 font-medium"
                    >
                      {preset.split(":")[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 border-t border-[#E2E8F0] bg-white flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isAdvisor ? "Write financial advice or recommendation..." : "Type message..."}
                  className="flex-grow px-4 py-2.5 bg-white border border-[#E2E8F0] placeholder-[#94A3B8] text-[#1F2937] text-xs rounded-xl focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all shadow-2xs"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="px-4 py-2.5 bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
                >
                  <span>Send</span>
                  <FiSend />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center flex-col text-[#64748B] p-8 space-y-2">
              <FiMessageSquare className="w-10 h-10 text-[#94A3B8]" />
              <h4 className="font-bold text-[#123B5D] text-base font-outfit">
                {isAdvisor ? "Select an Investor Client" : "No Chat Selected"}
              </h4>
              <p className="text-xs text-[#64748B] max-w-xs text-center leading-relaxed">
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
