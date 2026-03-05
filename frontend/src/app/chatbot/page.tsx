import Chatbot from "@/components/chatbot/Chatbot";
import { AuthRedirect } from "@/components/shared/AuthRedirect/AuthRedirect";

export default function ChatbotPage() {
  return (
    <>
      <AuthRedirect to="/login" condition="loggedOut" />
      <Chatbot />
    </>
  );
}