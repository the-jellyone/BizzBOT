"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import VoiceInterface from "@/components/VoiceInterface";
import { Mic, Send } from "lucide-react";

interface Message {
  role: string;
  content: string;
  streaming?: boolean;
}

export default function ChatPage() {
  const { user } = useUser();
  const { chatId } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !chatId) return;

    const userMessage: Message = { role: "human", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "44px";
    setLoading(true);
    setMessages((prev) => [...prev, { role: "ai", content: "", streaming: true }]);

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, chat_id: chatId, user_id: user.id }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);

          if (payload === "[DONE]") {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.role === "ai") updated[updated.length - 1] = { ...last, streaming: false };
              return updated;
            });
            setLoading(false);
            break;
          }

          if (payload.startsWith("[VOICE]")) continue;

          try {
            const token = JSON.parse(payload) as string;
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.role === "ai") updated[updated.length - 1] = { ...last, content: last.content + token };
              return updated;
            });
          } catch {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.role === "ai") updated[updated.length - 1] = { ...last, content: last.content + payload };
              return updated;
            });
          }
        }
      }
    } catch (error) {
      console.error("Streaming failed:", error);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "ai") updated[updated.length - 1] = { ...last, content: last.content || "Something went wrong. Please try again.", streaming: false };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewVoiceMessage = (userText: string, aiText: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "human", content: userText, streaming: false },
      { role: "ai",    content: aiText,   streaming: false },
    ]);
  };

  const renderContent = (msg: Message) => {
    if (msg.role !== "ai") return <span>{msg.content}</span>;

    if (msg.streaming) {
      return (
        <span style={{ fontSize: "13.5px", lineHeight: "1.75", whiteSpace: "pre-wrap" }}>
          {msg.content}
          <span className="cursor-blink" style={{ display: "inline-block", width: "2px", height: "14px", marginLeft: "2px", background: "#333", verticalAlign: "middle" }} />
        </span>
      );
    }

    return (
      <div className="bizzbot-prose" style={{ fontSize: "13.5px", lineHeight: "1.75", color: "#111" }}>
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div style={{ height: "100%", background: "#FFF5E1", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>

      {/* ── TOPBAR ── */}
      <div style={{
        height: "56px", padding: "0 24px",
        borderBottom: "3px solid black",
        background: "white",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            padding: "4px 12px",
            background: "limegreen",
            border: "3px solid black",
            fontWeight: 900, fontSize: "13px",
          }}>
            {chatId ? "Strategy Session" : "New Session"}
          </div>
          {chatId && (
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#999", letterSpacing: "1px" }}>
              #{(chatId as string).slice(0, 6).toUpperCase()}
            </span>
          )}
        </div>

        {/* Voice toggle */}
        <button
          onClick={() => setVoiceOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 16px",
            border: "3px solid black",
            background: voiceOpen ? "#FF6B6B" : "white",
            color: "black",
            fontWeight: 700, fontSize: "12px",
            cursor: "pointer",
            boxShadow: "3px 3px 0px black",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0px black"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px black"; }}
          title="Toggle voice"
        >
          <Mic size={14} />
          {voiceOpen ? "Close Voice" : "Voice Mode"}
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "24px",
          display: "flex", flexDirection: "column",
          scrollbarWidth: "thin", scrollbarColor: "#ccc transparent",
        }}>

          {messages.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", opacity: 0.5 }}>
              <div style={{ fontSize: "48px" }}>💼</div>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#555" }}>Ask me anything about your business.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              marginBottom: "20px",
              flexDirection: msg.role === "human" ? "row-reverse" : "row",
              gap: "10px",
              animation: "fadeUp 0.25s ease",
            }}>
              {/* Avatar */}
              <div style={{
                width: "32px", height: "32px", flexShrink: 0,
                background: msg.role === "human" ? "black" : "#4ECDC4",
                border: "3px solid black",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 900, color: "white",
              }}>
                {msg.role === "human" ? "U" : "AI"}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: msg.role === "human" ? "440px" : "580px",
                padding: "12px 16px",
                border: "3px solid black",
                boxShadow: "4px 4px 0px black",
                background: msg.role === "human" ? "#FF6B6B" : "white",
                color: "black",
              }}>
                {renderContent(msg)}
                <div style={{ fontSize: "9px", color: msg.role === "human" ? "rgba(0,0,0,0.5)" : "#aaa", marginTop: "6px", fontWeight: 600 }}>
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {msg.role === "ai" && !msg.streaming && " · Done"}
                </div>
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && messages[messages.length - 1]?.role !== "ai" && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", background: "#4ECDC4", border: "3px solid black", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 900 }}>AI</div>
              <div style={{ padding: "12px 16px", border: "3px solid black", boxShadow: "4px 4px 0px black", background: "white", display: "flex", gap: "5px", alignItems: "center" }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "black", animation: `blink 1.3s ease ${d}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* ── VOICE PANEL ── */}
        <div style={{
          width: voiceOpen ? "300px" : "0",
          overflow: "hidden",
          borderLeft: voiceOpen ? "4px solid black" : "none",
          background: "white",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          transition: "width 0.3s ease",
          flexShrink: 0,
        }}>
          {voiceOpen && (
            <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%" }}>
              <div style={{
                padding: "6px 16px",
                background: "#FFE66D",
                border: "3px solid black",
                fontWeight: 900, fontSize: "11px", letterSpacing: "2px",
                textTransform: "uppercase",
              }}>
                Voice Interface
              </div>

              <VoiceInterface
                chatId={chatId as string}
                userId={user?.id || ""}
                onNewMessage={handleNewVoiceMessage}
                setLoading={setLoading}
              />

              <div style={{
                padding: "12px 16px",
                border: "3px solid black",
                background: "#FFF5E1",
                fontSize: "11px", fontWeight: 700,
                textAlign: "center", lineHeight: "1.8", color: "#555",
              }}>
                Hold orb · Release to send<br />Reply appears in chat →
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── INPUT ── */}
      <div style={{
        borderTop: "4px solid black",
        background: "white",
        padding: "14px 24px 18px",
        flexShrink: 0,
      }}>
        <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "44px";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(e as any); }
            }}
            placeholder="Ask about strategy, growth, operations…"
            disabled={loading}
            rows={1}
            style={{
              flex: 1,
              background: "#FFF5E1",
              border: "3px solid black",
              padding: "11px 14px",
              fontSize: "13.5px",
              color: "black",
              resize: "none",
              minHeight: "44px", maxHeight: "120px",
              outline: "none", lineHeight: "1.5",
              fontFamily: "sans-serif",
              fontWeight: 500,
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "44px", height: "44px", flexShrink: 0,
              background: loading ? "#ccc" : "#FF6B6B",
              color: "black",
              border: "3px solid black",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: loading ? "none" : "3px 3px 0px black",
              transition: "all 0.15s",
              fontWeight: 900,
            }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0px black"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? "none" : "3px 3px 0px black"; }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink   { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: cursorBlink 1s ease infinite; }
        .bizzbot-prose h1, .bizzbot-prose h2, .bizzbot-prose h3 { font-weight: 900; margin: 12px 0 6px; }
        .bizzbot-prose p  { margin-bottom: 8px; }
        .bizzbot-prose ol, .bizzbot-prose ul { padding-left: 18px; margin-bottom: 8px; }
        .bizzbot-prose li { margin-bottom: 4px; }
        .bizzbot-prose strong { font-weight: 800; }
        .bizzbot-prose code { font-family: monospace; font-size: 12px; background: #FFE66D; padding: 1px 5px; border: 2px solid black; }
      `}</style>
    </div>
  );
}