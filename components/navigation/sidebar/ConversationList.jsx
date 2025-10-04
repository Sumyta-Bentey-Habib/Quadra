"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { dummyConversations } from "@/data/conversations";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ConversationList = () => {
	const [selectedConversation, setSelectedConversation] = useState(null);
	return (
		<div>
			<h2 className='p-4 text-xl font-bold border-b'>Messages</h2>
			{dummyConversations.map((conversation) => (
				<div key={conversation.id}>
					<Link
						href={`/messages/${conversation.id}`}
						className={cn(
							"p-4 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700  transition-colors",
							selectedConversation === conversation.id ? "bg-gray-200 dark:bg-gray-700" : "",
						)}
						onClick={() => setSelectedConversation(conversation.id)}
					>
						<Avatar>
							<AvatarImage
								src={conversation.avatar}
								alt={conversation.user}
							/>
							<AvatarFallback>{conversation.user[0].toUpperCase()}</AvatarFallback>
						</Avatar>
						<div className='flex-1'>
							<div className='font-semibold'>{conversation.user}</div>
							<div className='text-sm text-gray-500 truncate'>{conversation.lastMessage}</div>
						</div>
						<div className='text-xs text-gray-400'>{conversation.timestamp}</div>
					</Link>
					<Separator />
				</div>
			))}
		</div>
	);
};

export default ConversationList;
