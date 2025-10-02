import ROUTES from "./routes";
import { Home, Compass, Bell, Mail, Bookmark, User } from "lucide-react";

export const sidebarLinks = [
	{
		route: ROUTES.HOME,
		label: "Home",
		icon: Home,
	},
	{
		route: ROUTES.EXPLORE,
		label: "Explore",
		icon: Compass,
	},
	{
		route: ROUTES.NOTIFICATIONS,
		label: "Notifications",
		icon: Bell,
	},
	{
		route: ROUTES.MESSAGES,
		label: "Messages",
		icon: Mail,
	},
	{
		route: ROUTES.BOOKMARKS,
		label: "Bookmarks",
		icon: Bookmark,
	},
	{
		route: "/profile",
		label: "Profile",
		icon: User,
	},
];
