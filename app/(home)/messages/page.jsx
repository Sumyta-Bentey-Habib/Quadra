import ConversationList from "@/components/navigation/sidebar/ConversationList";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const MessagesPage = async () => {
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;

	const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/user/${userId}`, { cache: "no-store" });
	const conversations = await res.json();
	return (
		<>
			{/* Conversation List for smaller devices */}
			<div className='bg-background border-gray-200 overflow-y-auto w-full md:hidden'>
				<ConversationList
					initialConversations={conversations}
					currentUserId={userId}
				/>
			</div>
			<div className='md:flex justify-center items-center h-full text-gray-500 hidden'>Select a conversation</div>
		</>
	);
};

export default MessagesPage;
