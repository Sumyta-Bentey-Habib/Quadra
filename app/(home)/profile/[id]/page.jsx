"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { CheckCircle, Circle, Globe, Twitter, Linkedin } from "lucide-react";
import EditProfileModal from "@/components/ProfilePage/EditProfileModal";
import CreatePost from "@/components/ProfilePage/CreatePost";
import PostsUi from "@/components/PostsUi/PostsUi";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	const [ updateUi, setUpdateUi ] = useState(false)
	const [ updatePostUi, setUpdatePostUi ] = useState(false)

	const { data: session } = useSession();
	const userId = session?.user?.id;

	// Fetch posts for the current user
	useEffect(() => {
		const fetchPosts = async () => {
			if (!userId) return;
			try {
				const res = await fetch(`http://localhost:5000/posts?userId=${userId}`);
				const data = await res.json();
				setPosts(data);
			} catch (error) {
				console.error("Failed to fetch posts:", error);
			}
		};
		fetchPosts();
	}, [userId, updateUi]);

	// Fetch user data by ID
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch(`http://localhost:5000/users/${id}`);
				if (!res.ok) throw new Error("Failed to fetch user");
				const data = await res.json();
				setUser(data);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchUser();
	}, [id, updateUi ]);

	if (loading) {
		return (
			<div className='w-full min-h-screen flex items-center justify-center'>
				<p className='text-gray-500 dark:text-gray-400 text-lg'>Loading profile...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='w-full min-h-screen flex items-center justify-center'>
				<p className='text-gray-500 dark:text-gray-400 text-lg'>User not found.</p>
			</div>
		);
	}

	// Dynamic profile strength logic
	const steps = [
		{ label: "Added Bio", done: !!user.bio },
		{ label: "Added LinkedIn", done: !!user.linkedin },
		{ label: "Added Twitter / X", done: !!user.twitter },
		{ label: "Added Portfolio", done: !!user.portfolio },
	];

	const completedCount = steps.filter((s) => s.done).length;
	const totalSteps = steps.length;
	const completionPercentage = (completedCount / totalSteps) * 100;

	return (
		<div className='w-full min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-black'>
			<div className='grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 min-h-screen'>
				{/* --- Left Column (Profile Card) --- */}
				<div className='lg:col-span-2'>
					<div className='lg:sticky top-4'>
						<div className='bg-white dark:bg-black p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md'>
							{/* Profile Info */}
							<div className='text-center'>
								<div className='relative inline-block mb-4'>
									<img
										src={
											user.photoUrl ||
											"https://res.cloudinary.com/dizstnwr7/image/upload/v1759867578/profile_photos/aoizjrhbuerkt3o8gzdp.png"
										}
										alt={user.name}
										className='h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md hover:scale-105 transition-transform duration-300'
									/>
								</div>
								<h1 className='text-2xl sm:text-3xl font-serif font-bold'>{user.name}</h1>
								<p className='text-sm sm:text-md text-gray-500 dark:text-gray-400 font-mono mt-1'>{user.email}</p>

								{/* Bio */}
								{user.bio && (
									<p className='mt-3 text-gray-600 dark:text-gray-300 text-sm italic max-w-xs mx-auto'>“{user.bio}”</p>
								)}

								{/* Social Links */}
								<div className='flex justify-center gap-4 mt-4 text-gray-600 dark:text-gray-400'>
									{user.linkedin && (
										<a
											href={user.linkedin}
											target='_blank'
											rel='noopener noreferrer'
											className='hover:text-blue-600 dark:hover:text-blue-400'
										>
											<Linkedin size={20} />
										</a>
									)}
									{user.twitter && (
										<a
											href={user.twitter}
											target='_blank'
											rel='noopener noreferrer'
											className='hover:text-sky-500 dark:hover:text-sky-400'
										>
											<Twitter size={20} />
										</a>
									)}
									{user.portfolio && (
										<a
											href={user.portfolio}
											target='_blank'
											rel='noopener noreferrer'
											className='hover:text-green-600 dark:hover:text-green-400'
										>
											<Globe size={20} />
										</a>
									)}
								</div>
							</div>

							{/* Friends & Posts */}
							<div className='grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700 my-6 py-4'>
								<div className='text-center'>
									<p className='text-xl sm:text-2xl font-bold'>{user.friends || 0}</p>
									<p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest'>
										Friends
									</p>
								</div>
								<div className='text-center'>
									<p className='text-xl sm:text-2xl font-bold'>{posts?.length || 0}</p>
									<p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest'>Posts</p>
								</div>
							</div>

							{/* Profile Strength (only show if less than 100%) */}
							{completionPercentage < 100 && (
								<div>
									<div className='flex justify-between items-center mb-2'>
										<h2 className='font-semibold'>Profile Strength</h2>
										<p className='text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400'>
											{Math.round(completionPercentage)}%
										</p>
									</div>
									<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden'>
										<div
											className={`${
												completionPercentage < 50
													? "bg-red-300"
													: completionPercentage < 100
													? "bg-yellow-300"
													: "bg-green-300"
											} h-2 transition-all duration-500`}
											style={{ width: `${completionPercentage}%` }}
										></div>
									</div>
									<ul className='text-xs sm:text-sm space-y-2'>
										{steps.map((step, idx) => (
											<li
												key={idx}
												className={`flex items-center gap-2 ${
													step.done ? "text-green-300 dark:text-green-300" : "text-gray-400 dark:text-gray-500"
												}`}
											>
												{step.done ? (
													<CheckCircle
														size={16}
														className='text-green-300'
													/>
												) : (
													<Circle
														size={16}
														className='text-gray-300 dark:text-gray-600'
													/>
												)}
												{step.label}
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Edit Button */}
							<div className='mt-4 sm:mt-6'>
								<EditProfileModal user={ user } setUpdateUi={ setUpdateUi } updateUi={ updateUi } />
							</div>
						</div>
					</div>
				</div>

				{/* --- Right Column (Feed) --- */}
				<div className='lg:col-span-3 space-y-6 sm:space-y-8'>
					<CreatePost user={user} setUpdatePostUi={ setUpdatePostUi } updatePostUi={ updatePostUi } setUpdateUi={ setUpdateUi } updateUi={ updateUi } />
					<div className='space-y-4'>
						{/* Sorting */}
						{/* <div className="flex items-center justify-end gap-2">
              <label
                htmlFor="sort"
                className="text-gray-600 dark:text-gray-300 font-medium text-sm"
              >
                Sort by:
              </label>
              <select
                id="sort"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest</option>
              </select>
            </div> */}

						<div>
							<PostsUi user={user} setUpdatePostUi={ setUpdatePostUi } updatePostUi={ updatePostUi } setUpdateUi={ setUpdateUi } updateUi={ updateUi } />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
