import NotificationItem from "./NotificationItem";
import EmptyState from "./EmptyState";

const NotificationList = ({ notifications, onMarkAsRead, onDelete, getInitials }) => {
	if (notifications.length === 0) {
		return (
			<div className='max-w-4xl mx-auto px-4 py-6'>
				<EmptyState filter="all" />
			</div>
		);
	}

	return (
		<div className='max-w-4xl mx-auto px-4 py-6'>
			<div className='space-y-3'>
				{notifications.map((notification) => (
					<NotificationItem
						key={notification._id}
						notification={notification}
						onMarkAsRead={onMarkAsRead}
						onDelete={onDelete}
					/>
				))}
			</div>
		</div>
	);
};

export default NotificationList;
