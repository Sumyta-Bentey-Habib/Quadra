import ConversationList from "@/components/navigation/sidebar/ConversationList";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const MessagesLayout = async ({ children }) => {
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;

	const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/user/${userId}`, { cache: "no-store" });
	const conversations = await res.json();

	return (
		<div className='flex h-screen'>
			{/* Sidebar */}
			<div className='bg-background border-r overflow-y-auto no-scrollbar md:w-1/3 w-full hidden md:block'>
				<ConversationList
					conversations={conversations}
					currentUserId={userId}
				/>
			</div>

			{/* Chat window */}
			<div className='flex-1'>{children}</div>
		</div>
	);
};

export default MessagesLayout;
