"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { socket } from "@/lib/socket";

export default function MessageInput({ conversationId, senderId }) {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSend = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ conversationId, senderId, text: message }),
			});

			if (!res.ok) throw new Error("Failed to send message");
			await res.json();
			
			setMessage("");
		} catch (error) {
			console.error(error);
			toast.error("Could not send message");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSend}
			className='p-4 border-t bg-muted/50 flex items-center gap-2'
		>
			<Input
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder='Type a message...'
				className='flex-1'
			/>
			<Button
				type='submit'
				disabled={loading}
			>
				<Send className='h-4 w-4' />
			</Button>
		</form>
	);
}
