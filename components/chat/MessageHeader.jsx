"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const MessageHeader = ({ conversation }) => {
	const router = useRouter();

	return (
		<header className='p-4 border-b bg-muted/50 flex items-center gap-4'>
			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					size='sm'
					className='sm:hidden'
					onClick={() => router.push("/messages")}
				>
					<ArrowLeft />
				</Button>
				<Avatar className='ml-2'>
					<AvatarImage src={conversation.participantDetails[1]?.image} />
					<AvatarFallback>{conversation.participantDetails[1]?.name[0]}</AvatarFallback>
				</Avatar>
			</div>
			<div>
				<h2 className='font-semibold text-lg'>
					{conversation.isGroup ? conversation.groupName : conversation.participantDetails[1]?.name}
				</h2>
				<p className='text-sm text-muted-foreground'>
					{conversation.isGroup ? `${conversation.participants.length} members` : "Direct Message"}
				</p>
			</div>
		</header>
	);
};

export default MessageHeader;
