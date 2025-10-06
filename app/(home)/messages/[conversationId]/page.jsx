import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

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
		<div className='flex flex-col h-screen'>
			{/* Header */}
			<header className='p-4 border-b bg-muted/50 flex items-center justify-between'>
				<div>
					<h2 className='font-semibold text-lg'>
						{conversation.isGroup ? conversation.groupName : conversation.participantDetails?.name}
					</h2>
					<p className='text-sm text-muted-foreground'>
						{conversation.isGroup ? `${conversation.participants.length} members` : "Direct Message"}
					</p>
				</div>
			</header>

			{/* Messages List */}
			<MessageList
				messages={messages}
				currentUserId={userId}
				conversationId={conversationId}
			/>

			{/* Message Input */}
			<MessageInput
				conversationId={conversationId}
				senderId={userId}
			/>
		</div>
	);
}
