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
      <div className="space-y-1 border-b border-[#D7E2DC] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#15231D] flex items-center gap-3 font-outfit">
            <FiMessageSquare className="text-[#18A66A]" />
            {isAdvisor ? "Client Advisory Consult Terminal" : "Peer Advisory Room"}
          </h2>
          <p className="text-[#60736A] text-sm">
            {isAdvisor
              ? "Review assigned investor profiles and issue SEBI-compliant wealth advice."
              : "Connect with certified Sikka financial advisors for custom planning."}
          </p>
        </div>
        {isAdvisor && (
          <span className="self-start md:self-auto text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-[#E3F5ED] border border-[#18A66A]/30 text-[#123B2A] rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#18A66A] animate-pulse" />
            Certified Advisor Mode
          </span>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-grow flex border border-[#D7E2DC] rounded-3xl bg-white shadow-sm overflow-hidden min-h-[450px]">
        {/* Sidebar Contacts List */}
        <div className="w-80 border-r border-[#D7E2DC] bg-[#F5F7F2] flex flex-col">
          <div className="p-4 border-b border-[#D7E2DC] bg-white flex justify-between items-center">
            <span className="text-xs font-bold text-[#60736A] uppercase tracking-wider">
              {isAdvisor ? "Assigned Investor Clients" : "Certified Advisors"}
            </span>
            <span className="text-[10px] font-mono text-[#123B2A] bg-[#E3F5ED] px-2 py-0.5 rounded font-bold border border-[#18A66A]/30">
              {contacts.length}
            </span>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-[#D7E2DC]">
            {loadingContacts ? (
              <div className="p-6 text-center text-xs text-[#60736A]">
                Loading contact registry...
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#60736A] space-y-1">
                <FiInbox className="w-6 h-6 mx-auto text-[#8A9A92] mb-2" />
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
                        ? "bg-[#E3F5ED] border-l-4 border-l-[#18A66A]"
                        : "hover:bg-white"
                    }`}
                  >
                    <div className={`p-2 border rounded-xl text-sm shrink-0 ${
                      isSelected ? "bg-white border-[#18A66A]/30 text-[#18A66A]" : "bg-slate-100 border-slate-200 text-[#60736A]"
                    }`}>
                      <FiUser />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="font-bold text-[#15231D] text-sm truncate">{contact.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase text-[#123B2A] bg-[#E3F5ED] border-[#18A66A]/30">
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
              <div className="p-4 border-b border-[#D7E2DC] bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-[#18A66A]/30 rounded-xl text-xs bg-[#E3F5ED] text-[#18A66A]">
                    <FiUser />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#15231D] text-sm flex items-center gap-2 font-outfit">
                      {activeContact.name}
                      <span className="text-[10px] font-bold text-[#123B2A] bg-[#E3F5ED] px-2 py-0.5 rounded uppercase border border-[#18A66A]/30">
                        {activeContact.role}
                      </span>
                    </h4>
                    <p className="text-[10px] text-[#60736A] font-mono">{activeContact.email}</p>
                  </div>
                </div>
                {isAdvisor && (
                  <span className="text-[10px] font-bold text-[#123B2A] bg-[#E3F5ED] px-2.5 py-1 rounded-full border border-[#18A66A]/30">
                    Active Advisory Channel
                  </span>
                )}
              </div>

              {/* Messages feed */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 max-h-[500px]">
                {loadingThread ? (
                  <div className="text-center text-xs text-[#60736A] py-10">
                    Loading conversation thread...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-[#60736A] py-10 space-y-1">
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
                                ? "bg-[#18A66A] text-white shadow-sm font-medium"
                                : "bg-[#F5F7F2] border border-[#D7E2DC] text-[#15231D]"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[8px] text-[#8A9A92] font-mono text-right pr-2">
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
                <div className="px-4 py-2 bg-[#F5F7F2] border-t border-[#D7E2DC] flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] font-bold text-[#60736A] uppercase tracking-wider shrink-0">
                    Quick Advice:
                  </span>
                  {presetAdviceList.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(preset)}
                      className="px-2.5 py-1 bg-white hover:bg-[#E3F5ED] border border-[#D7E2DC] hover:border-[#18A66A] text-[#15231D] hover:text-[#123B2A] rounded-lg text-[10px] whitespace-nowrap transition-all shrink-0 font-medium"
                    >
                      {preset.split(":")[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 border-t border-[#D7E2DC] bg-white flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isAdvisor ? "Write financial advice or recommendation..." : "Type message..."}
                  className="flex-grow px-4 py-2.5 bg-white border border-[#D7E2DC] placeholder-[#8A9A92] text-[#15231D] text-xs rounded-xl focus:outline-none focus:border-[#18A66A] focus:ring-1 focus:ring-[#18A66A] transition-all shadow-2xs"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="px-4 py-2.5 bg-[#18A66A] hover:bg-[#159A63] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
                >
                  <span>Send</span>
                  <FiSend />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center flex-col text-[#60736A] p-8 space-y-2">
              <FiMessageSquare className="w-10 h-10 text-[#8A9A92]" />
              <h4 className="font-bold text-[#15231D] text-base font-outfit">
                {isAdvisor ? "Select an Investor Client" : "No Chat Selected"}
              </h4>
              <p className="text-xs text-[#60736A] max-w-xs text-center leading-relaxed">
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
