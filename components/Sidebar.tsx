"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const { user } = useUser();
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/${user.id}`)
        .then((res) => res.json())
        .then((data) => setChats(data));
    }
  }, [user]);

  const startNewChat = () => {
    const newId = Math.random().toString(36).substring(7);
    router.push(`/chat/${newId}`);
  };

  const deleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`, { method: "DELETE" });
      if (res.ok) {
        setChats((prev) => prev.filter((c: any) => c.chat_id !== chatId));
        if (window.location.pathname.includes(chatId)) router.push("/chat");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div
      style={{
        width: collapsed ? "60px" : "240px",
        height: "100%",
        background: "white",
        borderRight: "4px solid black",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* ── TOP: Logo + collapse ── */}
      <div style={{
        height: "64px",
        borderBottom: "4px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: collapsed ? "0 14px" : "0 16px",
        flexShrink: 0,
        gap: "8px",
      }}>
        {!collapsed && (
          <span style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
            Bizz<span style={{ color: "#FF6B6B" }}>Bot</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: "30px", height: "30px",
            border: "3px solid black",
            background: "white",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "3px 3px 0px black",
            flexShrink: 0,
            marginLeft: collapsed ? "auto" : "0",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0px black"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px black"; }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* ── BACK TO HOME ── */}
      <div style={{ padding: "10px 10px 0", flexShrink: 0 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: collapsed ? "8px" : "8px 12px",
            border: "3px solid black",
            background: "#FFE66D",
            color: "black",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "12px",
            boxShadow: "3px 3px 0px black",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "1px 1px 0px black"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "3px 3px 0px black"; }}
        >
          <ArrowLeft size={14} />
          {!collapsed && "Home"}
        </Link>
      </div>

      {/* ── NEW CHAT ── */}
      <div style={{ padding: "8px 10px 10px", borderBottom: "4px solid black", flexShrink: 0 }}>
        <button
          onClick={startNewChat}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", gap: "8px",
            padding: collapsed ? "8px" : "8px 12px",
            border: "3px solid black",
            background: "#FF6B6B",
            color: "black",
            fontWeight: 700, fontSize: "12px",
            cursor: "pointer",
            boxShadow: "3px 3px 0px black",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0px black"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px black"; }}
          title="New conversation"
        >
          <Plus size={14} />
          {!collapsed && "New conversation"}
        </button>
      </div>

      {/* ── CHAT HISTORY ── */}
      {!collapsed && (
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0", scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }}>
          <p style={{
            padding: "0 16px 8px",
            fontSize: "9px", fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase", color: "#999",
          }}>
            History
          </p>

          {chats.map((chat: any, idx: number) => (
            <div
              key={chat.chat_id}
              className="group"
              style={{ position: "relative", margin: "2px 8px" }}
            >
              <Link
                href={`/chat/${chat.chat_id}`}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 36px 8px 10px",
                  border: "2px solid transparent",
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "12.5px",
                  fontWeight: 500,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "#FFF5E1";
                  el.style.borderColor = "black";
                  el.style.boxShadow = "3px 3px 0px black";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "transparent";
                  el.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#aaa", flexShrink: 0 }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {chat.title || "Untitled"}
                </span>
              </Link>

              <button
                onClick={(e) => deleteChat(e, chat.chat_id)}
                style={{
                  position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)",
                  padding: "4px", background: "transparent", border: "2px",
                  cursor: "pointer", color: "#aaa", opacity: 1,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#FF6B6B";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
                }}
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── USER FOOTER ── */}
      <div style={{
        borderTop: "4px solid black",
        padding: collapsed ? "12px 0" : "12px 14px",
        display: "flex", alignItems: "center", gap: "10px",
        justifyContent: collapsed ? "center" : "flex-start",
        flexShrink: 0,
        background: "#FFF5E1",
      }}>
        <div style={{
          width: "32px", height: "32px",
          background: "black", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 900,
          border: "3px solid black",
          flexShrink: 0,
        }}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "black" }}>
              {user?.fullName || "User"}
            </div>
            <div style={{ fontSize: "10px", color: "#888", fontWeight: 600 }}>
              Active
            </div>
          </div>
        )}
      </div>
    </div>
  );
}