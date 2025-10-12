import { formatTime } from "@/lib/utils";

const NotificationContent = ({ notification }) => {
	return (
		<div className='flex-1 min-w-0'>
			<p className='text-sm'>
				<span className='font-semibold hover:underline cursor-pointer'>
					{notification.sender?.name || "Someone"}
				</span>{" "}
				<span className='text-muted-foreground'>{notification.content}</span>
			</p>

			{notification.postPreview && (
				<div className='mt-2 p-3 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted transition-colors'>
					<p className='text-sm text-muted-foreground line-clamp-2'>{notification.postPreview}</p>
				</div>
			)}

			{notification.comment && (
				<div className='mt-2 p-3 bg-muted/50 rounded-lg border'>
					<p className='text-sm text-muted-foreground italic'>"{notification.comment}"</p>
				</div>
			)}

			<p className='mt-2 text-xs text-muted-foreground'>{formatTime(notification.createdAt)}</p>
		</div>
	);
};

export default NotificationContent;
