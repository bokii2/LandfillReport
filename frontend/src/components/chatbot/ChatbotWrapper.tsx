"use client";

import { usePathname } from "next/navigation";
import Chatbot from "@/components/chatbot/Chatbot";

// Pages where the chatbot should NOT appear
const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function ChatbotWrapper() {
  const pathname = usePathname();

  if (PUBLIC_ROUTES.includes(pathname)) return null;

  return <Chatbot />;
}