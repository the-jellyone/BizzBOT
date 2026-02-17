"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceInterfaceProps {
  chatId: string;
  userId: string;
  onNewMessage: (userText: string, aiText: string) => void;
  setLoading: (loading: boolean) => void;
}

type OrbState = "idle" | "listening" | "responding";

export default function VoiceInterface({ chatId, userId, onNewMessage, setLoading }: VoiceInterfaceProps) {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const barsRef = useRef<number[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    barsRef.current = Array.from({ length: 24 }, () => Math.random());
  }, []);

  const handleMouseDown = async () => {
    setOrbState("listening");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        await sendVoiceToBackend(audioBlob);
      };
      recorder.start();
    } catch {
      alert("Mic access denied.");
      setOrbState("idle");
    }
  };

  const handleMouseUp = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setOrbState("responding");
    }
  };

  const sendVoiceToBackend = async (audioBlob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "input.wav");
    formData.append("user_id", userId);
    formData.append("chat_id", chatId);

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/voice-chat", { method: "POST", body: formData });
      if (!res.ok) { console.error("Voice error:", res.status); return; }

      const rawUserText = res.headers.get("X-User-Text");
      const rawAiText   = res.headers.get("X-AI-Text");
      const userText = rawUserText ? decodeURIComponent(rawUserText) : "Voice message";
      const aiText   = rawAiText   ? decodeURIComponent(rawAiText)   : "Check the screen for the response.";

      onNewMessage(userText, aiText);

      // Stop any currently playing audio before starting new one
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = "";
        currentAudioRef.current = null;
      }

      const blob     = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio    = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.play();
      audio.onended = () => { URL.revokeObjectURL(audioUrl); currentAudioRef.current = null; setOrbState("idle"); };
    } catch (err) {
      console.error("Voice failed:", err);
      onNewMessage("Voice message", "Something went wrong.");
      setOrbState("idle");
    } finally {
      setLoading(false);
    }
  };

  const isListening  = orbState === "listening";
  const isResponding = orbState === "responding";
  const isActive     = isListening || isResponding;

  const WaveBar = ({ rand, i, active, color }: { rand: number; i: number; active: boolean; color: string }) => (
    <div
      style={{
        width: "3px",
        borderRadius: "3px",
        backgroundColor: color,
        height: active ? `${8 + rand * 32}px` : "4px",
        transition: "height 0.15s ease, background-color 0.3s ease",
        animationName: active ? "waveBar" : "none",
        animationDuration: active ? `${0.4 + rand * 0.6}s` : "0s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationDelay: `${i * 0.04}s`,
      }}
    />
  );

  return (
    <div className="flex items-center gap-6">

      {/* ── WAVEFORM LEFT ── */}
      <div className="flex items-center gap-[3px]" style={{ height: "40px" }}>
        {barsRef.current.slice(0, 12).map((rand, i) => (
          <WaveBar
            key={i}
            rand={rand}
            i={i}
            active={isListening}
            color={isListening ? "#111" : "#ddd"}
          />
        ))}
      </div>

      {/* ── ORB ── */}
      <div className="relative flex items-center justify-center" style={{ width: "80px", height: "80px" }}>
        {/* Aura rings */}
        {isActive && [80, 100, 120].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              backgroundColor: isListening
                ? `rgba(28,25,22,${0.08 - i * 0.02})`
                : `rgba(74,124,158,${0.1 - i * 0.025})`,
              animationName: "auraRing",
              animationDuration: `${1.4 + i * 0.3}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}

        {/* Core orb */}
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="relative z-10 flex items-center justify-center rounded-full transition-all duration-300 select-none"
          style={{
            width: "56px", height: "56px",
            background: isListening ? "#111" : isResponding ? "transparent" : "white",
            border: isListening
              ? "3px solid black"
              : isResponding
              ? "3px solid #4A7C9E"
              : "3px solid black",
            cursor: "pointer",
            fontSize: "18px",
            boxShadow: isListening
              ? "4px 4px 0px black"
              : isResponding
              ? "4px 4px 0px #4A7C9E"
              : "4px 4px 0px black",
          }}
          title="Hold to speak"
        >
          {isListening ? (
            <span style={{ filter: "invert(1)" }}>🎙</span>
          ) : isResponding ? (
            <span>🔊</span>
          ) : (
            <span>🎙</span>
          )}
        </button>
      </div>

      {/* ── WAVEFORM RIGHT ── */}
      <div className="flex items-center gap-[3px]" style={{ height: "40px" }}>
        {barsRef.current.slice(12, 24).map((rand, i) => (
          <WaveBar
            key={i}
            rand={rand}
            i={i}
            active={isResponding}
            color={isResponding ? "#4A7C9E" : "#ddd"}
          />
        ))}
      </div>

      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
        @keyframes auraRing {
          from { transform: scale(0.9); opacity: 0.6; }
          to   { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}