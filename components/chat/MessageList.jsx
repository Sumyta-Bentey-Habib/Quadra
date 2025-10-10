/**
 * MessageList Component - Main Chat Interface
 *
 * This is the core component that displays all messages in a conversation.
 * Handles real-time message updates, message editing, deletion, and status tracking.
 *
 * Key Features:
 * - Real-time message updates via Socket.io
 * - Message status indicators (sent, delivered, read)
 * - Message editing and deletion functionality
 * - Auto-scroll to latest messages
 * - Responsive message layout (own vs others' messages)
 *
 * Socket Events Handled:
 * - newMessage: New messages from other users
 * - messageDeleted: When messages are deleted
 * - messageEdited: When messages are edited
 * - messageStatusUpdated: Real-time status updates
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import ForwardMessageModal from "./ForwardMessageModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessageStatusIndicator from "./MessageStatusIndicator";
import { formatMessageTime } from "@/lib/timestamp";

export default function MessageList({ messages: initialMessages, currentUserId, conversationId, conversations }) {
	const [messages, setMessages] = useState(initialMessages);
	const session = useSession();
	const user = session?.data?.user;
	const scrollRef = useRef(null);
	const [hoveredMessageId, setHoveredMessageId] = useState(null);
	const [forwardMessage, setForwardMessage] = useState(null);
	const [deleteMessage, setDeleteMessage] = useState(null);
	const [editMessage, setEditMessage] = useState(null);
	const [editText, setEditText] = useState("");

	const handleDelete = async () => {
		if (!deleteMessage) return;

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${deleteMessage._id}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ senderId: currentUserId }),
				}
			);

			if (!res.ok) throw new Error("Failed to delete message");

			toast.success("Message deleted successfully!");
			setDeleteMessage(null);
		} catch (error) {
			console.error(error);
			toast.error("Could not delete message");
		}
	};

	const handleEdit = async () => {
		if (!editMessage) return;

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${editMessage._id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ text: editText, senderId: currentUserId }),
				}
			);

			if (!res.ok) throw new Error("Failed to edit message");

			toast.success("Message edited successfully!");
			setEditMessage(null);
		} catch (error) {
			console.error(error);
			toast.error("Could not edit message");
		}
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

		// Join conversation room
		socket.emit("joinConversation", conversationId);

		// Socket event listeners
		const handleNewMessage = (message) => {
			if (message.conversationId === conversationId) {
				setMessages((prev) => [...prev, message]);

				// Mark message as delivered if it's not from current user
				if (message.senderId !== currentUserId) {
					socket.emit("messageDelivered", {
						messageId: message._id,
						userId: currentUserId
					});
				}
			}
		};

		const handleMessageDeleted = (deletedMessage) => {
			setMessages((prev) => prev.map((msg) => (msg._id === deletedMessage._id ? deletedMessage : msg)));
		};

		const handleMessageEdited = (updatedMessage) => {
			setMessages((prev) => prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg)));
		};

		const handleMessageStatusUpdated = (data) => {
			setMessages((prev) => prev.map((msg) =>
				msg._id === data.messageId
					? { ...msg, status: { ...msg.status, ...data.status } }
					: msg
			));
		};

		socket.on("newMessage", handleNewMessage);
		socket.on("messageDeleted", handleMessageDeleted);
		socket.on("messageEdited", handleMessageEdited);
		socket.on("messageStatusUpdated", handleMessageStatusUpdated);

		return () => {
			socket.off("newMessage", handleNewMessage);
			socket.off("messageDeleted", handleMessageDeleted);
			socket.off("messageEdited", handleMessageEdited);
			socket.emit("leaveConversation", conversationId);
		};
	}, [conversationId]);

	useEffect(() => {
		// Scroll to the bottom whenever the messages state updates
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);
	return (
		<>
			<div className='space-y-4'>
				{messages.map((msg) => {
					const isOwn = msg.senderId === currentUserId;
					return (
						<div
							key={msg._id}
							className={`flex items-center gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
							onMouseEnter={() => setHoveredMessageId(msg._id)}
							onMouseLeave={() => setHoveredMessageId(null)}
						>
							{!isOwn && (
								<Avatar className='mr-2'>
									<AvatarImage src={msg.sender?.imageUrl} />
									<AvatarFallback>{msg.sender?.name?.[0]}</AvatarFallback>
								</Avatar>
							)}
							{editMessage?._id === msg._id ? (
								<div className="flex items-center gap-2">
									<Input value={editText} onChange={(e) => setEditText(e.target.value)} />
									<Button onClick={handleEdit}>Save</Button>
									<Button variant="outline" onClick={() => setEditMessage(null)}>Cancel</Button>
								</div>
							) : (
								<div className="flex flex-col">
									<div
										className={`max-w-xs rounded-2xl px-4 py-2 ${
											isOwn ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground"
										}`}
									>
										<p>{msg.text}</p>
										<div className="flex items-center justify-between mt-1">
											<p className='text-xs text-muted-foreground'>
												{formatMessageTime(msg.createdAt)}
											</p>
											<MessageStatusIndicator status={msg.status} isOwn={isOwn} />
										</div>
									</div>
								</div>
							)}
							{isOwn && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button className={`focus:outline-none ${hoveredMessageId === msg._id ? "opacity-100" : "opacity-0"} transition-opacity`}>
											<MoreVertical size={16} />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem onSelect={() => {
											setEditMessage(msg);
											setEditText(msg.text);
										}}>Edit</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => setDeleteMessage(msg)}>Delete</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => setForwardMessage(msg)}>Forward</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
							{isOwn && (
								<Avatar className='ml-2'>
									<AvatarImage src={user?.imageUrl} />
									<AvatarFallback>{user?.name[0]}</AvatarFallback>
								</Avatar>
							)}
						</div>
					);
				})}
				<div ref={scrollRef} />
			</div>
			{forwardMessage && (
				<ForwardMessageModal
					open={!!forwardMessage}
					setOpen={() => setForwardMessage(null)}
					message={forwardMessage}
					conversations={conversations}
					currentUserId={currentUserId}
				/>
			)}
			{deleteMessage && (
				<AlertDialog open={!!deleteMessage} onOpenChange={() => setDeleteMessage(null)}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>This action cannot be undone. This will permanently delete the message.</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	);
}
