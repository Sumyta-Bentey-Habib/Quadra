import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationAvatar = ({ notification }) => {
	const getInitials = (name) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	return (
		<div className='relative flex-shrink-0'>
			<Avatar className='w-10 h-10'>
				<AvatarImage
					src={notification.sender?.photoUrl}
					alt={notification.sender?.name}
				/>
				<AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm'>
					{getInitials(notification.sender?.name || "Unknown")}
				</AvatarFallback>
			</Avatar>
			{!notification.read && (
				<div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-background'></div>
			)}
		</div>
	);
};

export default NotificationAvatar;
