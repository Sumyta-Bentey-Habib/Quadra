import NotificationIcon from "./NotificationIcon";
import NotificationAvatar from "./NotificationAvatar";
import NotificationContent from "./NotificationContent";
import NotificationActions from "./NotificationActions";

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
	return (
		<div
			className={`group rounded-xl border transition-all duration-200 hover:shadow-md ${
				!notification.read
					? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800"
					: "border-border bg-card hover:bg-muted/50"
			}`}
		>
			<div className='p-4'>
				<div className='flex items-start gap-3'>
					<NotificationIcon type={notification.type} />
					<NotificationAvatar notification={notification} />
					<NotificationContent notification={notification} />
					<NotificationActions
						notification={notification}
						onMarkAsRead={onMarkAsRead}
						onDelete={onDelete}
					/>
				</div>
			</div>
		</div>
	);
};

export default NotificationItem;
