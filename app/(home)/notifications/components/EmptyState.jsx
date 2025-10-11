import { Bell } from "lucide-react";

const EmptyState = ({ filter }) => {
	return (
		<div className='rounded-2xl border border-dashed p-12 text-center'>
			<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4'>
				<Bell className='h-8 w-8 text-muted-foreground' />
			</div>
			<h3 className='text-xl font-semibold mb-2'>No notifications</h3>
			<p className='text-muted-foreground'>
				{filter === "unread" ? "You're all caught up!" : "You don't have any notifications yet"}
			</p>
		</div>
	);
};

export default EmptyState;
