"use client";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import NewConversationCombobox from "@/components/chat/NewConversationCombobox";
import { cn } from "@/lib/utils";
import SearchConversation from "../search/SearchConversation";
import { useState } from "react";
import NewGroupModal from "./NewGroupModal";

export default function ConversationListHeader({ currentUserId, onSearch }) {
	const [open, setOpen] = useState(false);
	const [openGroup, setOpenGroup] = useState(false);

	return (
		<div className='flex items-center gap-2 p-3 border-b bg-muted/50'>
			{/* Search Input */}
			<SearchConversation onSearch={onSearch} />

			{/* New Conversation Button */}
			<NewConversationCombobox
				currentUserId={currentUserId}
				open={open}
				setOpen={setOpen}
				trigger={
					<Button
						size='icon'
						variant='outline'
						onClick={() => setOpen(!open)}
						className={cn(open && "bg-accent")}
					>
						<Plus className='h-4 w-4' />
					</Button>
				}
			/>
			{/* New Group Button */}
			<Button
				size='icon'
				variant='outline'
				onClick={() => setOpenGroup(true)}
			>
				<Users className='h-4 w-4' />
			</Button>

			{/* Group Creation Modal */}
			<NewGroupModal
				open={openGroup}
				setOpen={setOpenGroup}
				currentUserId={currentUserId}
			/>
		</div>
	);
}
