import { Check, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationActions = ({ notification, onMarkAsRead, onDelete }) => {
	return (
		<div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
			{!notification.read && (
				<Button
					variant='ghost'
					size='sm'
					onClick={() => onMarkAsRead(notification._id)}
					className='h-8 w-8 p-0'
					title='Mark as read'
				>
					<Check className='h-4 w-4' />
				</Button>
			)}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='h-8 w-8 p-0'
					>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem onClick={() => onDelete(notification._id)}>
						<Trash2 className='h-4 w-4 mr-2' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default NotificationActions;
