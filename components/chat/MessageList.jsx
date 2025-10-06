"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";

export default function MessageList({ messages: initialMessages, currentUserId, conversationId }) {
	const [messages, setMessages] = useState(initialMessages);
	const bottomRef = useRef(null);
	const session = useSession();
	const user = session?.data?.user;

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
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<ScrollArea className='flex-1 px-4 py-2'>
			<div className='space-y-4'>
				{messages.map((msg) => {
					const isOwn = msg.senderId === currentUserId;
                    console.log(msg);
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
				<div ref={bottomRef} />
			</div>
		</ScrollArea>
	);
}
