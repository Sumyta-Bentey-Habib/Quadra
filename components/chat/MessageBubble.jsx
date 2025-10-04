import { cn } from "@/lib/utils";

const MessageBubble = ({ msg }) => {
	const isMe = msg.sender === "me";
	return (
		<div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
			<div
				className={cn(
					"px-4 py-2 rounded-2xl max-w-xs break-words",
					isMe ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground",
				)}
			>
				{msg.text}
				<div className='text-[10px] text-gray-300 mt-1'>{msg.time}</div>
			</div>
		</div>
	);
};

export default MessageBubble;
