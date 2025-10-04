"use client";
import { useParams, useRouter } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import { dummyConversations, dummyMessages } from "@/data/conversations";

const ConversationPage = () => {
  const { conversationId } = useParams();
  const router = useRouter();
  const convId = Number(conversationId);

  const conversation = dummyConversations.find((c) => c.id === convId);

  if (!conversation) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Conversation not found
      </div>
    );
  }

  const handleBack = () => {
    router.push("/messages");
  };

  return (
    <ChatWindow
      messages={dummyMessages[convId]}
      user={conversation.user}
      onBack={handleBack}
    />
  );
};

export default ConversationPage;
