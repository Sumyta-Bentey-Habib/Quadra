import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NotificationHeader = ({ unreadCount, onMarkAllAsRead }) => {
	return (
		<div className='sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b'>
			<div className='max-w-4xl mx-auto px-4 py-6'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center'>
							<Bell className='h-5 w-5 text-white' />
						</div>
						<div>
							<h1 className='text-2xl font-bold'>Notifications</h1>
							{unreadCount > 0 && (
								<div className='flex items-center gap-2'>
									<Badge
										variant='destructive'
										className='text-xs'
									>
										{unreadCount} unread
									</Badge>
									<span className='text-sm text-muted-foreground'>notification{unreadCount !== 1 ? "s" : ""}</span>
								</div>
							)}
						</div>
					</div>

					{unreadCount > 0 && (
						<Button
							variant='outline'
							size='sm'
							onClick={onMarkAllAsRead}
							className='flex items-center gap-2'
						>
							<Check className='h-4 w-4' />
							Mark all read
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default NotificationHeader;
