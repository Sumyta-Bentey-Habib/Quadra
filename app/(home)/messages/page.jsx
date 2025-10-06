import ConversationList from "@/components/navigation/sidebar/ConversationList";

const MessagesPage = () => {
	return (
		<>
			{/* Conversation List for smaller devices */}
			<div className='bg-background border-gray-200 overflow-y-auto w-full md:hidden'>
				<ConversationList />
			</div>
			<div className='md:flex justify-center items-center h-full text-gray-500 hidden'>Select a conversation</div>
		</>
	);
};

export default MessagesPage;
