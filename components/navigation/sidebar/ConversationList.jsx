"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ConversationListHeader from "@/components/chat/ConversationListHeader";
import { useSession } from "next-auth/react";

const ConversationList = () => {
	const [conversations, setConversations] = useState([]);
	const [filteredConversations, setFilteredConversations] = useState([]);
	const [loading, setLoading] = useState(false);
	const params = useParams();
	const session = useSession();
	const currentUserId = session?.data?.user?.id;
	const selectedConversation = params?.conversationId || null;

	// Fetch conversations from backend
	useEffect(() => {
		const fetchConversations = async () => {
			try {
				setLoading(true);
				const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/${currentUserId}`);
				const data = await res.json();
				setConversations(data);
				setFilteredConversations(data);
			} catch (err) {
				console.error("Error fetching conversations:", err);
			} finally {
				setLoading(false);
			}
		};
		if (currentUserId) fetchConversations();
	}, [currentUserId]);

	// Handle search input
	const handleSearch = (term) => {
		if (!term.trim()) {
			setFilteredConversations(conversations);
			return;
		}
		const filtered = conversations.filter((conversation) => {
			if (conversation.isGroup)
				return conversation.groupName.toLowerCase().includes(term.toLowerCase());
			return conversation.participantDetails[0]?.name
				?.toLowerCase()
				.includes(term.toLowerCase());
		});
		setFilteredConversations(filtered);
	};

	if (loading) {
		return <p className='p-4 text-center text-gray-500'>Loading conversations...</p>;
	}

	return (
		<div>
			<h2 className='p-4 text-xl font-bold border-b'>Messages</h2>
			{/* Header */}
			<ConversationListHeader currentUserId={currentUserId} onSearch={handleSearch} />

			{/* Conversation List */}
			{filteredConversations.map((conversation) => {
				const otherParticipant = conversation.isGroup
					? { name: conversation.groupName, image: null }
					: conversation.participantDetails[0];
				return (
					<div key={conversation._id}>
						<Link
							href={`/messages/${conversation._id}`}
							className={cn(
								"p-4 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700  transition-colors",
								selectedConversation === conversation._id ? "bg-gray-200 dark:bg-gray-700" : "",
							)}
						>
							<Avatar>
								{conversation.isGroup ? (
									<AvatarFallback>{conversation.groupName[0]}</AvatarFallback>
								) : (
									<>
										<AvatarImage
											src={otherParticipant?.image}
											alt={otherParticipant?.name}
										/>
										<AvatarFallback>{otherParticipant?.name[0]}</AvatarFallback>
									</>
								)}
							</Avatar>
							<div className='flex-1'>
								<h2 className='font-semibold'>
									{conversation.isGroup ? conversation.groupName : otherParticipant?.name}
								</h2>
								<p className='text-sm text-gray-500 truncate'>{conversation.lastMessage?.text || "No messages yet"}</p>
							</div>
							<p className='text-xs text-gray-400'>
								{conversation.lastMessage ? new Date(conversation.lastMessage.createdAt).toLocaleDateString() : ""}
							</p>
						</Link>
						<Separator />
					</div>
				);
			})}
		</div>
	);
};

export default ConversationList;
