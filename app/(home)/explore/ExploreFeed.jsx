"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PostCard from "../postcards/page";
import { useSession } from "next-auth/react";
import axios from "axios";

const ExploreFeed = () => {
	const [posts, setPosts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState("all");
	const { data: session } = useSession();
	const [userData, setUserData] = useState(null);

	const userEmail = session?.user?.email;
	const userName = session?.user?.name;
	const avatar = session?.user?.image;

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts`);
			const data = await res.json();
			setPosts(data);
		};

		fetchPosts();
	}, []);

	// Fetch user data
	useEffect(() => {
		if (!userEmail) return;
		const fetchUser = async () => {
			try {
				const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
				const user = res.data.find((u) => u.email === userEmail);
				setUserData(user || null);
			} catch (err) {
				console.error("Error fetching user:", err);
			}
		};
		fetchUser();
	}, [userEmail]);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleFilter = (value) => {
		setFilter(value);
	};

	const filteredPosts = posts
		.filter((post) => {
			if (filter === "today") {
				const today = new Date();
				const postDate = new Date(post.createdAt);
				return (
					postDate.getDate() === today.getDate() &&
					postDate.getMonth() === today.getMonth() &&
					postDate.getFullYear() === today.getFullYear()
				);
			} else if (filter === "this-week") {
				const today = new Date();
				const postDate = new Date(post.createdAt);
				const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
				return postDate >= firstDayOfWeek;
			} else if (filter === "this-month") {
				const today = new Date();
				const postDate = new Date(post.createdAt);
				return postDate.getMonth() === today.getMonth() && postDate.getFullYear() === today.getFullYear();
			} else {
				return true;
			}
		})
		.filter((post) => {
			const searchTermLower = searchTerm.toLowerCase();
			return post.text.toLowerCase().includes(searchTermLower) || post.userName.toLowerCase().includes(searchTermLower);
		});

	return (
		<div className='w-full max-w-2xl'>
			<div className='flex gap-4 mb-6'>
				<Input
					type='text'
					placeholder='Search posts...'
					value={searchTerm}
					onChange={handleSearch}
					className='flex-1'
				/>
				<Select
					onValueChange={handleFilter}
					defaultValue='all'
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Filter by date' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All time</SelectItem>
						<SelectItem value='today'>Today</SelectItem>
						<SelectItem value='this-week'>This week</SelectItem>
						<SelectItem value='this-month'>This month</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{/* Feed */}
			{filteredPosts.map((post) => (
				<PostCard
					key={post._id}
					post={post}
					userData={userData}
					userName={userName}
					avatar={avatar}
				/>
			))}
		</div>
	);
};

export default ExploreFeed;
