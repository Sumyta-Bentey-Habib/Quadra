"use client";
import ConversationList from "@/components/navigation/sidebar/ConversationList";

const MessagesLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-background border-r overflow-y-auto md:w-1/3 w-full hidden md:block">
        <ConversationList />
      </div>

      {/* Chat window */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MessagesLayout;
