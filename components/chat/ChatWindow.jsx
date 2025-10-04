import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageBubble from "./MessageBubble";
import { ArrowLeft, Send } from "lucide-react";

const ChatWindow = ({ messages, user, onBack }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-4">
        {onBack && (
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={onBack}
          >
            <ArrowLeft />
          </Button>
        )}
        <div className="font-bold text-lg">{user}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages?.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <Input placeholder="Start a message..." className="flex-1" />
        <Button>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
