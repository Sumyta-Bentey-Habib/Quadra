/**
 * MessageInput Component - Chat Input Interface
 *
 * Handles message composition, typing indicators, and message sending.
 * Provides real-time typing feedback and message submission functionality.
 *
 * Key Features:
 * - Real-time typing indicators with 1-second debounce
 * - Message validation (prevents empty messages)
 * - Loading states during message sending
 * - Automatic typing indicator cleanup
 * - Socket authentication and connection management
 *
 * Socket Events Emitted:
 * - typing: When user starts/stops typing
 * - messageDelivered: When message is sent (marks as delivered)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";

/**
 * MessageInput Component - Handles message composition and sending
 * @param {Object} props
 * @param {string} props.conversationId - ID of the current conversation
 * @param {string} props.senderId - ID of the user sending the message
 * @returns {JSX.Element} Message input form
 */
export default function MessageInput({ conversationId, senderId }) {
	// Message state and loading state
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	// Reference for typing timeout management
	const typingTimeoutRef = useRef(null);

	// Get current user session for typing indicators
	const session = useSession();
	const userName = session?.data?.user?.name;

	/**
	 * Emits typing events to notify other users
	 * @param {boolean} isTyping - Whether user is currently typing
	 */
	const handleTyping = (isTyping) => {
		socket.emit("typing", {
			conversationId,
			userId: senderId,
			userName,
			isTyping,
		});
	};

	/**
	 * Handles input changes and manages typing indicators
	 * Implements debounced typing detection (1 second delay)
	 * @param {Event} e - Input change event
	 */
	const handleInputChange = (e) => {
		setMessage(e.target.value);

		// Emit typing start event
		handleTyping(true);

		// Clear previous timeout if exists
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set new timeout to stop typing indicator after 1 second of inactivity
		typingTimeoutRef.current = setTimeout(() => {
			handleTyping(false);
		}, 1000);
	};

	/**
	 * Handles message submission
	 * Validates message, sends to server, and manages UI state
	 * @param {Event} e - Form submit event
	 */
	const handleSend = async (e) => {
		e.preventDefault();

		// Prevent sending empty messages
		if (!message.trim()) return;

		// Stop typing indicator immediately
		handleTyping(false);
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ conversationId, senderId, text: message }),
			});

			if (!res.ok) throw new Error("Failed to send message");
			const newMessage = await res.json();

			// Clear input after successful send
			setMessage("");

			// Emit message delivered event for the sent message
			socket.emit("messageDelivered", {
				messageId: newMessage._id,
				userId: senderId
			});
		} catch (error) {
			console.error(error);
			toast.error("Could not send message");
		} finally {
			setLoading(false);
		}
	};

	// Socket connection and cleanup effect
	useEffect(() => {
		// Connect socket if not already connected
		if (!socket.connected) {
			socket.connect();
		}

		// Authenticate user if not already authenticated
		if (socket.connected && senderId && !socket.authenticated) {
			socket.emit("authenticate", senderId);
			socket.authenticated = true;
		}

		// Cleanup function to clear typing timeout and stop typing indicator
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
				handleTyping(false);
			}
		};
	}, [senderId]);

	return (
		<form
			onSubmit={handleSend}
			className='p-4 border-t bg-muted/50 flex items-center gap-2'
		>
			<Input
				value={message}
				onChange={handleInputChange}
				placeholder='Type a message...'
				className='flex-1'
				disabled={loading}
			/>
			<Button
				type='submit'
				disabled={loading || !message.trim()}
			>
				<Send className='h-4 w-4' />
			</Button>
		</form>
	);
}
