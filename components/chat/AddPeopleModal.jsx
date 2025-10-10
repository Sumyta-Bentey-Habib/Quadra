"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AddPeopleModal({ open, setOpen, conversation, currentUserId }) {
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
			const data = await res.json();
			// Filter out existing participants
			const existingParticipantIds = conversation.participants;
			const filteredUsers = data.filter((user) => !existingParticipantIds.includes(user._id));
			setUsers(filteredUsers);
		};

		if (open) {
			fetchUsers();
		}
	}, [open, conversation]);

	const toggleUser = (user) => {
		setSelectedUsers((prev) =>
			prev.some((u) => u._id === user._id)
				? prev.filter((u) => u._id !== user._id)
				: [...prev, user]
		);
	};

	const handleAddPeople = async () => {
		if (selectedUsers.length === 0) {
			toast.error("Please select at least one person to add.");
			return;
		}

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/${conversation._id}/members`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ newMemberIds: selectedUsers.map(u => u._id) }),
				}
			);

			if (!res.ok) throw new Error("Failed to add people");

			toast.success("People added successfully!");
			setOpen(false);
		} catch (error) {
			console.error(error);
			toast.error("Could not add people");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add People</DialogTitle>
				</DialogHeader>
				<div className='max-h-64 overflow-y-auto border rounded-md p-2 space-y-2'>
					{users.map((user) => (
						<div
							key={user._id}
							className={cn(
								"flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition",
								selectedUsers.some((u) => u._id === user._id) && "bg-muted"
							)}
							onClick={() => toggleUser(user)}
						>
							<Avatar className='h-6 w-6'>
								<AvatarImage src={user.image} alt={user.name} />
								<AvatarFallback>{user.name[0]}</AvatarFallback>
							</Avatar>
							<span className='text-sm'>{user.name}</span>
							{selectedUsers.some((u) => u._id === user._id) && (
								<Check className='h-4 w-4 ml-auto text-primary' />
							)}
						</div>
					))}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={handleAddPeople}>Add People</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
