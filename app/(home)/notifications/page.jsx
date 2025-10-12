"use client";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import NotificationHeader from "./components/NotificationHeader";
import NotificationFilters from "./components/NotificationFilters";
import NotificationList from "./components/NotificationList";
import LoadingState from "./components/LoadingState";

const NotificationsPage = () => {
	const { data: session } = useSession();
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [unreadCount, setUnreadCount] = useState(0);

	// Fetch notifications from backend
	const fetchNotifications = async (filterType = "all") => {
		if (!session?.user?.id) return;

		try {
			setLoading(true);
			let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/${session.user.id}`;

			if (filterType === "unread") {
				url += "?read=false";
			} else if (filterType !== "all") {
				url += `?type=${filterType}`;
			}

			const response = await fetch(url);
			if (response.ok) {
				const data = await response.json();
				console.log("Fetched notifications:", data);
				setNotifications(data);
			} else {
				console.error("Failed to fetch notifications:", response.status, response.statusText);
			}
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch unread count
	const fetchUnreadCount = async () => {
		if (!session?.user?.id) return;

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/${session.user.id}/count`);
			if (response.ok) {
				const data = await response.json();
				setUnreadCount(data.count);
			}
		} catch (error) {
			console.error("Failed to fetch unread count:", error);
		}
	};

	// Initialize data and socket connection
	useEffect(() => {
		if (session?.user?.id) {
			fetchNotifications(filter);
			fetchUnreadCount();

			// Set up polling to check for new notifications every 10 seconds
			const interval = setInterval(() => {
				fetchNotifications(filter);
				fetchUnreadCount();
			}, 30000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [session?.user?.id, filter]);

	// Handle filter changes
	useEffect(() => {
		fetchNotifications(filter);
	}, [filter]);

	const markAsRead = async (notificationId) => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/${notificationId}/read`, {
				method: "PATCH",
			});

			if (response.ok) {
				setNotifications((prev) => prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)));
				setUnreadCount((prev) => Math.max(0, prev - 1));
			}
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
		}
	};

	const markAllAsRead = async () => {
		if (!session?.user?.id) return;

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/user/${session.user.id}/read-all`,
				{ method: "PATCH" },
			);

			if (response.ok) {
				setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
				setUnreadCount(0);
			}
		} catch (error) {
			console.error("Failed to mark all notifications as read:", error);
		}
	};

	const deleteNotification = async (notificationId) => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/${notificationId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				const deletedNotification = notifications.find((n) => n._id === notificationId);
				setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
				if (!deletedNotification?.read) {
					setUnreadCount((prev) => Math.max(0, prev - 1));
				}
			}
		} catch (error) {
			console.error("Failed to delete notification:", error);
		}
	};

	const getInitials = (name) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	const filteredNotifications = notifications.filter((notification) => {
		if (filter === "unread") return !notification.read;
		if (filter === "all") return true;
		return notification.type === filter;
	});

	if (loading) {
		return <LoadingState />;
	}

	return (
		<div className='min-h-screen bg-background'>
			<NotificationHeader
				unreadCount={unreadCount}
				onMarkAllAsRead={markAllAsRead}
			/>

			<NotificationFilters
				currentFilter={filter}
				onFilterChange={setFilter}
			/>

			<NotificationList
				notifications={filteredNotifications}
				onMarkAsRead={markAsRead}
				onDelete={deleteNotification}
			/>
		</div>
	);
};

export default NotificationsPage;
