import Sidebar from "@/components/Sidebar";
import { UserButton } from "@clerk/nextjs";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#FFF5E1",
      overflow: "hidden",
      fontFamily: "sans-serif",
    }}>
      <Sidebar />

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: "64px",
          borderBottom: "4px solid black",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 24px",
          flexShrink: 0,
          gap: "12px",
        }}>
          {/* Online indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "6px 12px",
            border: "2px solid black",
            background: "#A8E6CF",
            fontSize: "11px", fontWeight: 700,
          }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "black" }} />
            Online
          </div>

          <UserButton afterSignOutUrl="/" />
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </div>
    </div>
  );
}