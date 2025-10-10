"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ForwardMessageModal({ open, setOpen, message, conversations, currentUserId }) {
	const [selectedConversation, setSelectedConversation] = useState(null);

	const handleForward = async () => {
		if (!selectedConversation) {
			toast.error("Please select a conversation to forward the message to.");
			return;
		}

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/forward`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					messageId: message._id,
					forwardToConversationId: selectedConversation,
					senderId: currentUserId,
				}),
			});

			if (!res.ok) throw new Error("Failed to forward message");

			toast.success("Message forwarded successfully!");
			setOpen(false);
		} catch (error) {
			console.error(error);
			toast.error("Could not forward message");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Forward Message</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p>Select a conversation to forward this message to:</p>
					<div className="max-h-60 overflow-y-auto">
						{conversations.map((convo) => (
							<div
								key={convo._id}
								className={`p-2 rounded-md cursor-pointer ${selectedConversation === convo._id ? "bg-muted" : ""}`}
								onClick={() => setSelectedConversation(convo._id)}
							>
								{convo.isGroup ? convo.groupName : convo.participantDetails.find(p => p._id !== currentUserId)?.name}
							</div>
						))}
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={handleForward}>Forward</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}