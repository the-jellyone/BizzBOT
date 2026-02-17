import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth(); // Get the secure Clerk ID
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { message, chatId } = await req.json();

  // Forward to your FastAPI backend
  const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      chat_id: chatId || "default-chat", // Matches your multi-chat structure
      message: message,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}