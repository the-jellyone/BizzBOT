"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sparkles, ArrowRight, Mic, MessageCircle, Headphones, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFF5E1", fontFamily: "sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "68px",
        borderBottom: "4px solid black",
        background: "white",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#FF6B6B" }}>BizzBot</span>
          <sup style={{ fontSize: "9px", fontWeight: 700, color: "#555", letterSpacing: "2px", verticalAlign: "super", marginLeft: "3px" }}>AI</sup>
        </span>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <SignedOut>
            <SignInButton mode="modal">
              <button style={{
                padding: "10px 22px",
                border: "3px solid black", background: "white",
                fontWeight: 700, fontSize: "13px", cursor: "pointer",
                boxShadow: "4px 4px 0px black", transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px black"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px black"; }}>
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/chat" style={{
              padding: "10px 22px",
              background: "#FF6B6B", color: "black",
              border: "3px solid black", textDecoration: "none",
              fontWeight: 700, fontSize: "13px",
              boxShadow: "4px 4px 0px black",
              display: "inline-flex", alignItems: "center", gap: "6px",
            }}>
              Open Dashboard <ArrowRight size={15} />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "80px 40px",
        borderBottom: "4px solid black",
        background: "white",
      }}>
        {/* Decorative shapes */}
        <div style={{ position: "absolute", top: "40px", right: "80px", width: "100px", height: "100px", background: "#FF6B6B", border: "4px solid black", transform: "rotate(12deg)" }} />
        <div style={{ position: "absolute", bottom: "40px", left: "60px", width: "72px", height: "72px", background: "#4ECDC4", border: "4px solid black", transform: "rotate(-6deg)" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>

            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "8px 16px", background: "limegreen",
                border: "4px solid black", boxShadow: "6px 6px 0px black",
                fontWeight: 700, fontSize: "14px", width: "fit-content",
              }}>
                <Sparkles size={18} /> AI-Powered
              </div>

              <h1 style={{ fontSize: "clamp(44px, 6vw, 76px)", fontWeight: 900, lineHeight: 1.05, margin: 0,color:"Black", }}>
                Where strategy meets ,<br />
                <span style={{ color: "#FF6B6B" }}>meets execution.</span><br />
              </h1>

              <p style={{ fontSize: "20px", lineHeight: 1.7, color: "#333", maxWidth: "440px", margin: 0 }}>
               From insights to impact.
              </p>

              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <Link href="/chat" style={{
                  padding: "14px 28px",
                  background: "#FF6B6B", color: "black",
                  border: "4px solid black", textDecoration: "none",
                  fontWeight: 800, fontSize: "15px",
                  boxShadow: "8px 8px 0px black",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  transition: "all 0.15s",
                }}>
                  Start a session <ArrowRight size={18} />
                </Link>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button style={{
                      padding: "14px 28px",
                      background: "white", color: "black",
                      border: "4px solid black",
                      fontWeight: 800, fontSize: "15px",
                      cursor: "pointer",
                      boxShadow: "8px 8px 0px black",
                      transition: "all 0.15s",
                    }}>
                      Sign in
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>

            {/* Right — chat bubble mockup */}
            <div style={{ position: "relative" }}>
              <div style={{
                background: "#FFF5E1", border: "4px solid black",
                boxShadow: "12px 12px 0px black",
                padding: "32px", display: "flex", flexDirection: "column", gap: "16px",
              }}>
                {[
                  { role: "You 🎤", msg: '"What should be my Q3 growth focus?"', align: "left", bg: "limegreen" },
                  { role: "BizzBot", msg: '"Double down on retention — your churn is costing more than acquisition."', align: "right", bg: "#4ECDC4" },
                  { role: "You 🎤", msg: '"How do I reduce churn fast?"', align: "left", bg: "limegreen" },
                  { role: "BizzBot", msg: '"3 levers: onboarding gaps, pricing tiers, proactive support."', align: "right", bg: "#A8E6CF" },
                ].map(({ role, msg, align, bg }, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: align === "right" ? "flex-end" : "flex-start", gap: "4px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#555" }}>{role}</span>
                    <div style={{
                      padding: "10px 14px", background: bg,
                      border: "3px solid black", boxShadow: "4px 4px 0px black",
                      fontWeight: 600, fontSize: "13px", maxWidth: "80%",
                    }}>
                      {msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 40px", background: "white", borderBottom: "4px solid black" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{
              display: "inline-block", padding: "8px 20px",
              background: "limegreen", border: "4px solid black",
              boxShadow: "6px 6px 0px black",
              fontWeight: 700, fontSize: "14px", marginBottom: "20px",
            }}>
              FEATURES
            </div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, margin: 0, color:"Black" ,}}>
              Everything You Need
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {[
              { Icon: Mic,           title: "Voice Interface",   desc: "Ask questions out loud. Get answers hands-free while you work.",          color: "#FF6B6B" },
              { Icon: MessageCircle, title: "Text Chat",         desc: "Prefer typing? Full chat interface works seamlessly too.",                 color: "#4ECDC4" },
              { Icon: Headphones,    title: "Executive Briefs",  desc: "Concise summaries and strategic briefs on demand.",                       color: "#FFE66D" },
              { Icon: Sparkles,      title: "Live Research",     desc: "Real-time web research baked into every response.",                       color: "#A8E6CF" },
            ].map(({ Icon, title, desc, color }) => (
              <div key={title} style={{
                background: "Orange", border: "4px solid black",
                boxShadow: "8px 8px 0px black", padding: "28px",
                transition: "all 0.15s", cursor: "default",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(4px,4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "4px 4px 0px black"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "8px 8px 0px black"; }}>
                <div style={{ width: "56px", height: "56px", background: color, border: "3px solid black", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <Icon size={26} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 10px 0" }}>{title}</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#444", margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "80px 40px", background: "#FF6B6B",
        borderBottom: "4px solid black",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: "20px", right: "120px", width: "120px", height: "120px", background: "#FFE66D", border: "4px solid black", transform: "rotate(12deg)", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: "20px", left: "120px", width: "80px", height: "80px", background: "#4ECDC4", border: "4px solid black", transform: "rotate(-6deg)", opacity: 0.5 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, color: "white", margin: "0 0 16px 0" }}>
            Start a session<br />right now.
          </h2>

          <Link href="/chat" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "16px 40px", background: "#FFE66D", color: "black",
            border: "4px solid black", textDecoration: "none",
            fontWeight: 900, fontSize: "18px", boxShadow: "10px 10px 0px black",
            transition: "all 0.15s",
          }}>
            Get Started Now <ArrowRight size={22} />
          </Link>

          <p style={{ marginTop: "24px", color: "white", fontWeight: 700 }}>
            Setup takes less than 5 minutes ⚡
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "black", color: "white",
      }}>
        <span style={{ fontWeight: 900, fontSize: "14px" }}>
          Bizz<span style={{ color: "#FF6B6B" }}>Bot</span> AI
        </span>
        <span style={{ fontSize: "11px", color: "#aaa", letterSpacing: "2px" }}>
          STRATEGY · GROWTH · OPERATIONS · © 2025
        </span>
      </footer>
    </div>
  );
}