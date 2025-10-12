import { Heart, MessageCircle, UserPlus, Share2, Bell } from "lucide-react";

const NotificationIcon = ({ type }) => {
	const getIcon = (type) => {
		switch (type) {
			case "like":
				return <Heart className='h-4 w-4' />;
			case "comment":
				return <MessageCircle className='h-4 w-4' />;
			case "follow":
				return <UserPlus className='h-4 w-4' />;
			case "share":
				return <Share2 className='h-4 w-4' />;
			default:
				return <Bell className='h-4 w-4' />;
		}
	};

	const getIconColor = (type) => {
		switch (type) {
			case "like":
				return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
			case "comment":
				return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
			case "follow":
				return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
			case "share":
				return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
			default:
				return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	return (
		<div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(type)}`}>
			{getIcon(type)}
		</div>
	);
};

export default NotificationIcon;
