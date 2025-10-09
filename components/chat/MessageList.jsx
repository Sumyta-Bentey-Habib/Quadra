"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";

export default function MessageList({ messages: initialMessages, currentUserId, conversationId }) {
	const [messages, setMessages] = useState(initialMessages);
	const session = useSession();
	const user = session?.data?.user;
	const scrollRef = useRef(null);

	useEffect(() => {
		socket.emit("joinConversation", conversationId);
		socket.on("newMessage", (message) => {
			if (message.conversationId === conversationId) {
				setMessages((prev) => [...prev, message]);
			}
		});
		return () => {
			socket.off("newMessage");
		};
	}, [conversationId]);

	useEffect(() => {
		// Scroll to the bottom whenever the messages state updates
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);
	return (
		<div className='space-y-4'>
			{messages.map((msg) => {
				const isOwn = msg.senderId === currentUserId;
				return (
					<div
						key={msg._id}
						className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
					>
						{!isOwn && (
							<Avatar className='mr-2'>
								<AvatarImage src={msg.sender?.image} />
								<AvatarFallback>{msg.sender?.name?.[0]}</AvatarFallback>
							</Avatar>
						)}
						<div
							className={`max-w-xs rounded-2xl px-4 py-2 ${
								isOwn ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground"
							}`}
						>
							<p>{msg.text}</p>
							<p className='text-xs text-muted-foreground mt-1 text-right'>
								{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
							</p>
						</div>
						{isOwn && (
							<Avatar className='ml-2'>
								<AvatarImage src={user?.image} />
								<AvatarFallback>{user?.name[0]}</AvatarFallback>
							</Avatar>
						)}
					</div>
				);
			})}
			<div ref={scrollRef} /> 
		</div>
	);
}
