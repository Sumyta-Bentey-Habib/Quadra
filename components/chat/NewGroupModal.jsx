"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewGroupModal({ open, setOpen, currentUserId }) {
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [groupName, setGroupName] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (open) {
			fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`)
				.then((res) => res.json())
				.then((data) => setUsers(data.filter((u) => u._id !== currentUserId)));
		}
	}, [open, currentUserId]);

	const toggleUser = (user) => {
		setSelectedUsers((prev) =>
			prev.some((u) => u._id === user._id)
				? prev.filter((u) => u._id !== user._id)
				: [...prev, user],
		);
	};

	const handleCreateGroup = async () => {
		if (!groupName.trim() || selectedUsers.length === 0) {
			toast("Please enter a group name and select at least one user.");
			return;
		}

		const participantIds = [currentUserId, ...selectedUsers.map((u) => u._id)];

		const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				participants: participantIds,
				isGroup: true,
				groupName,
			}),
		});

		const data = await res.json();
		setOpen(false);
		router.push(`/messages/${data._id}`);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>Create New Group</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<Input
						placeholder='Enter group name...'
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
					/>

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

					<Button onClick={handleCreateGroup} className='w-full'>
						Create Group
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
