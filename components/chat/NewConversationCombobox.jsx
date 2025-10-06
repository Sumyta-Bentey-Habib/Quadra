"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function NewConversationCombobox({ currentUserId, open, setOpen, trigger }) {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`)
			.then((res) => res.json())
			.then((data) => setUsers(data.filter((u) => u._id !== currentUserId)));
	}, [currentUserId]);

	const handleSelect = async (user) => {
		setSelectedUser(user);
		setOpen(false);

		// Check existing conversation
		const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations/check`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ participants: [currentUserId, user._id] }),
		});

		const existing = await res.json();

		if (existing.exists) {
			router.push(`/messages/${existing.conversationId}`);
			return;
		}

		// Create new conversation
		const createRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ participants: [currentUserId, user._id], isGroup: false }),
		});

		const data = await createRes.json();

		router.push(`/messages/${data._id}`);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent className='w-[240px] p-0'>
				<Command>
					<CommandInput placeholder='Search users...' />
					<CommandList>
						<CommandEmpty>No users found.</CommandEmpty>
						<CommandGroup>
							{users.map((user) => (
								<CommandItem
									key={user._id}
									onSelect={() => handleSelect(user)}
									className='flex items-center gap-2'
								>
									<Avatar className='h-5 w-5'>
										<AvatarImage
											src={user.image}
											alt={user.name}
										/>
										<AvatarFallback>{user.name[0]}</AvatarFallback>
									</Avatar>
									<span>{user.name}</span>
									<Check
										className={cn("ml-auto h-4 w-4", selectedUser?._id === user._id ? "opacity-100" : "opacity-0")}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
