"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ConversationListHeader from "@/components/chat/ConversationListHeader";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { formatMessageTime } from "@/lib/timestamp";

const ConversationList = ({ currentUserId, initialConversations }) => {
	const [conversations, setConversations] = useState(initialConversations || []);
	const [filteredConversations, setFilteredConversations] = useState([]);
	const params = useParams();
	const selectedConversation = params?.conversationId || null;
	const { data: session } = useSession();

	useEffect(() => {
		const fetchConversations = async () => {
			if (!currentUserId) return;

			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/user/${currentUserId}`, { cache: "no-store" });
				const data = await res.json();
				setConversations(data);
				setFilteredConversations(data);
			} catch (error) {
				console.error("Failed to fetch conversations:", error);
			}
		};

		fetchConversations();
	}, [currentUserId]);

	// Handle search input
	const handleSearch = (term) => {
		if (!term.trim()) {
			setFilteredConversations(conversations);
			return;
		}
		const filtered = conversations?.filter((conversation) => {
			if (conversation.isGroup) return conversation.groupName.toLowerCase().includes(term.toLowerCase());
			const otherParticipant = conversation.participantDetails.find(p => p._id !== session?.user?.id);
			return otherParticipant?.name?.toLowerCase().includes(term.toLowerCase());
		});
		setFilteredConversations(filtered);
	};

	useEffect(() => {
		// Connect socket if not connected
		if (!socket.connected) {
			socket.connect();
		}

		// Authenticate user if not already authenticated
		if (socket.connected && currentUserId && !socket.authenticated) {
			socket.emit("authenticate", currentUserId);
			socket.authenticated = true;
		}

		// Socket event listeners
		const handleConversationUpdated = (update) => {
			setConversations((prev) =>
				prev.map((c) =>
					c._id === update.conversationId ? { ...c, lastMessage: update.lastMessage, updatedAt: update.updatedAt } : c
				)
			);
			setFilteredConversations((prev) =>
				prev.map((c) =>
					c._id === update.conversationId ? { ...c, lastMessage: update.lastMessage, updatedAt: update.updatedAt } : c
				)
			);
		};

		const handleNewConversation = (newConversation) => {
			setConversations((prev) => [newConversation, ...prev]);
			setFilteredConversations((prev) => [newConversation, ...prev]);
		};

		socket.on("conversationUpdated", handleConversationUpdated);
		socket.on("newConversation", handleNewConversation);

		return () => {
			socket.off("conversationUpdated", handleConversationUpdated);
			socket.off("newConversation", handleNewConversation);
		};
	}, []);

	return (
		<>
			<section className='sticky top-0 right-0 z-30 bg-background'>
				<h2 className='p-4 text-xl font-bold'>Messages</h2>
				<Separator />
				{/* Header */}
				<ConversationListHeader
					currentUserId={currentUserId}
					onSearch={handleSearch}
				/>
			</section>
			<section>
				{/* Conversation List */}
				{filteredConversations?.map((conversation) => {
					const otherParticipant = conversation.participantDetails.find(p => p._id !== session?.user?.id);
					return (
						<article key={conversation._id}>
							<Link
								href={`/messages/${conversation._id}`}
								className={cn(
									"p-4 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700  transition-colors",
									selectedConversation === conversation._id ? "bg-muted dark:bg-muted/40" : ""
								)}
							>
								<div className="relative">
									<Avatar>
										{conversation.isGroup ? (
											<AvatarFallback>{conversation.groupName[0]}</AvatarFallback>
										) : (
											<>
												<AvatarImage
													src={otherParticipant?.photoUrl}
													alt={otherParticipant?.name}
												/>
												<AvatarFallback>{otherParticipant?.name[0]}</AvatarFallback>
											</>
										)}
									</Avatar>
									{!conversation.isGroup && (
										<div
											className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
												otherParticipant?.isOnline ? 'bg-green-500' : 'bg-red-500'
											}`}
										/>
									)}
								</div>
								<div className='flex-1'>
									<h2 className='font-semibold'>
										{conversation.isGroup ? conversation.groupName : otherParticipant?.name}
									</h2>
									<p className='text-sm text-gray-500 truncate'>
										{conversation.lastMessage?.text || "No messages yet"}
									</p>
								</div>
								<p className='text-xs text-gray-400'>
									{conversation.lastMessage ? formatMessageTime(conversation.lastMessage.createdAt) : ""}
								</p>
							</Link>
							<Separator />
						</article>
					);
				})}
			</section>
		</>
	);
};

export default ConversationList;
