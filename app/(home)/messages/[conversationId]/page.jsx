import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import MessageHeader from "@/components/chat/MessageHeader";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function ConversationPage({ params }) {
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;
	const conversationId = (await params).conversationId;

	// Fetch conversation details + messages
	const [conversationRes, messagesRes] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/${conversationId}`, { cache: "no-store" }),
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${conversationId}`, { cache: "no-store" }),
	]);

	const conversation = await conversationRes.json();
	const messages = await messagesRes.json();

	return (
		<div className='min-h-full flex flex-col'>
			{/* Message Header */}
			<MessageHeader conversation={conversation} />
			{/* Messages List */}
			<ScrollArea className='h-[calc(100vh-150px)] px-4 py-2'>
				<MessageList
					messages={messages}
					currentUserId={userId}
					conversationId={conversationId}
				/>
			</ScrollArea>
			{/* Message Input */}
			<MessageInput
				conversationId={conversationId}
				senderId={userId}
			/>
		</div>
	);
}
