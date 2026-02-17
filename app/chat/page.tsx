"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 1. Generate a random ID
    const newChatId = Math.random().toString(36).substring(7);
    // 2. Immediately send the user to the dynamic route
    router.replace(`/chat/${newChatId}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );
}