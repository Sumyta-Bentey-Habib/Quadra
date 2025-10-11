"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart, MessageCircle, Send, Bookmark, X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const BACKEND_URL = "http://localhost:5000" || process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PostCard({ post, userData, userName, avatar }) {
	// Bookmark & alerts
	const [bookmarked, setBookmarked] = useState(false);
	const [bookmarkLoading, setBookmarkLoading] = useState(false);
	const [alert, setAlert] = useState({ type: "", message: "" });

	// Images
	const [showAllImages, setShowAllImages] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalIndex, setModalIndex] = useState(0);

	// Comments
	const [commentsVisible, setCommentsVisible] = useState(false);
	const [comments, setComments] = useState(post.comments || []);
	const [commentText, setCommentText] = useState("");
	const [showReplyInput, setShowReplyInput] = useState({});
	const [replyText, setReplyText] = useState({});

	useEffect(() => {
		if (!userData?.bookmarks) return;
		const isBookmarked = userData.bookmarks.some((id) => id === post._id || id === post._id.toString());
		setBookmarked(isBookmarked);
	}, [userData, post._id]);

	const showAlert = (type, message) => {
		setAlert({ type, message });
		setTimeout(() => setAlert({ type: "", message: "" }), 3000);
	};

	const handleToggleBookmark = async () => {
		if (!userData?._id) return showAlert("error", "User not loaded yet");
		setBookmarkLoading(true);
		try {
			if (!bookmarked) {
				await axios.post(`${BACKEND_URL}/bookmarks`, {
					userId: userData._id,
					postId: post._id,
				});
				setBookmarked(true);
				showAlert("success", "Post added to bookmarks!");
			} else {
				await axios.delete(`${BACKEND_URL}/bookmarks/${userData._id}/${post._id}`);
				setBookmarked(false);
				showAlert("success", "Bookmark removed!");
			}
		} catch (err) {
			console.error(err);
			showAlert("error", err.response?.data?.message || "Failed to toggle bookmark");
		} finally {
			setBookmarkLoading(false);
		}
	};

	// Images handling
	const imagesToShow = showAllImages ? post.images : post.images?.slice(0, 4) || [];
	const openModal = (index) => {
		setModalIndex(index);
		setModalOpen(true);
	};
	const closeModal = () => setModalOpen(false);
	const prevImage = () => setModalIndex((i) => (i === 0 ? post.images.length - 1 : i - 1));
	const nextImage = () => setModalIndex((i) => (i === post.images.length - 1 ? 0 : i + 1));

	// Comments handling
	const fetchComments = async () => {
		try {
			const res = await axios.get(`${BACKEND_URL}/posts/${post._id}/comments`);
			setComments(res.data);
			setCommentsVisible(true);
		} catch (err) {
			console.error("Error fetching comments:", err);
		}
	};

	const handleAddComment = async () => {
		if (!commentText.trim()) return;
		try {
			const res = await axios.post(`${BACKEND_URL}/posts/${post._id}/comments`, {
				userId: userData._id,
				userName,
				avatar,
				text: commentText,
			});
			const newComment = res.data.comment;
			setComments((prev) => [...prev, newComment]);
			setCommentText("");
			setCommentsVisible(true);
		} catch (err) {
			console.error("Error adding comment:", err);
			alert("Failed to add comment");
		}
	};

	const handleAddReply = async (commentId) => {
		const text = replyText[commentId];
		if (!text?.trim()) return;
		try {
			const res = await axios.post(`${BACKEND_URL}/posts/${post._id}/comments/${commentId}/replies`, {
				userId: userData._id,
				userName,
				avatar,
				text,
			});
			const newReply = res.data.reply;
			setComments((prev) =>
				prev.map((c) => (c._id === commentId ? { ...c, replies: [...(c.replies || []), newReply] } : c)),
			);
			setReplyText((prev) => ({ ...prev, [commentId]: "" }));
			setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
		} catch (err) {
			console.error("Error adding reply:", err);
			alert("Failed to add reply");
		}
	};

	return (
		<div className='border rounded-lg p-4 mb-4 shadow relative '>
			{alert.message && (
				<Alert
					variant={alert.type === "error" ? "destructive" : "default"}
					className='mb-3'
				>
					<AlertTitle>{alert.type === "error" ? "Error" : "Success"}</AlertTitle>
					<AlertDescription>{alert.message}</AlertDescription>
				</Alert>
			)}

			{/* Post Header */}
			<div className='flex items-center mb-3'>
				<img
					src={post.avatar || "https://i.pravatar.cc/100"}
					alt='avatar'
					className='w-10 h-10 rounded-full mr-3'
				/>
				<div>
					<p className='font-semibold'>{post.userName || "Anonymous"}</p>
					<p className='text-sm text-gray-500'>{new Date(post.createdAt).toLocaleString()}</p>
				</div>
			</div>

			{/* Post Text */}
			{post.text && <p className='mb-3'>{post.text}</p>}

			{/* Post Images Grid */}
			{post.images && post.images.length > 0 && (
				<div
					className={cn(
						"grid gap-2 mb-3 h-max",
						post.images.length === 1
							? "grid-cols-1"
							: post.images.length === 2
							? "grid-cols-2"
							: "grid-cols-2",
					)}
				>
					{imagesToShow.map((img, idx) => (
						<div
							key={idx}
							className='relative cursor-pointer'
							onClick={() => openModal(idx)}
						>
							<img
								src={img}
								alt={`Post image ${idx + 1}`}
								className='w-full h-full object-cover rounded-md'
							/>
							{!showAllImages && idx === 3 && post.images.length > 4 && (
								<div
									className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold rounded-md'
									onClick={() => setShowAllImages(true)}
								>
									+{post.images.length - 4}
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{/* Post Actions */}
			<div className='flex items-center justify-between text-gray-600 mb-2'>
				<button className='flex items-center space-x-1'>
					<Heart className='w-5 h-5' /> <span>{post.likes?.length || 0}</span>
				</button>
				<button
					onClick={() => (commentsVisible ? setCommentsVisible(false) : fetchComments())}
					className='flex items-center space-x-1'
				>
					<MessageCircle className='w-5 h-5' /> <span>{comments?.length || 0}</span>
				</button>
				<button className='flex items-center space-x-1'>
					<Send className='w-5 h-5' /> <span>Share</span>
				</button>
				{userData?._id && (
					<button
						onClick={handleToggleBookmark}
						disabled={bookmarkLoading}
						className='flex items-center space-x-1'
					>
						<Bookmark className={`w-5 h-5 ${bookmarked ? "text-blue-600 fill-blue-600" : ""}`} />
						<span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
					</button>
				)}
			</div>

			{/* Comments Section */}
			{commentsVisible && (
				<div className='mt-4 border-t pt-3'>
					{comments.length === 0 && <p className='text-sm text-gray-500 mb-2'>No comments yet.</p>}
					{comments.map((c) => (
						<div
							key={c._id}
							className='flex flex-col mb-3'
						>
							<div className='flex items-start'>
								<img
									src={c.avatar || "https://i.pravatar.cc/100"}
									alt='avatar'
									className='w-8 h-8 rounded-full mr-2'
								/>
								<div className='bg-gray-100 p-2 rounded-lg flex-1'>
									<p className='text-sm font-semibold'>{c.userName}</p>
									<p className='text-sm'>{c.text}</p>
									<p className='text-xs text-gray-400'>{new Date(c.createdAt).toLocaleString()}</p>

									{/* Reply Button */}
									<button
										className='text-xs text-blue-600 mt-1 hover:underline'
										onClick={() =>
											setShowReplyInput((prev) => ({
												...prev,
												[c._id]: !prev[c._id],
											}))
										}
									>
										Reply
									</button>

									{/* Reply Input */}
									{showReplyInput[c._id] && (
										<div className='flex items-center mt-1'>
											<input
												type='text'
												value={replyText[c._id] || ""}
												onChange={(e) =>
													setReplyText((prev) => ({
														...prev,
														[c._id]: e.target.value,
													}))
												}
												placeholder='Write a reply...'
												className='border rounded-md p-1 flex-1 text-sm'
											/>
											<button
												className='ml-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm'
												onClick={() => handleAddReply(c._id)}
											>
												Reply
											</button>
										</div>
									)}

									{/* Replies */}
									{c.replies?.map((r) => (
										<div
											key={r._id}
											className='flex items-start ml-10 mt-1'
										>
											<img
												src={r.avatar || "https://i.pravatar.cc/100"}
												alt='avatar'
												className='w-6 h-6 rounded-full mr-2'
											/>
											<div className='bg-gray-200 p-2 rounded-lg flex-1'>
												<p className='text-sm font-semibold'>{r.userName}</p>
												<p className='text-sm'>{r.text}</p>
												<p className='text-xs text-gray-400'>{new Date(r.createdAt).toLocaleString()}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					))}

					{/* Add New Comment */}
					<div className='flex items-center mt-2'>
						<input
							type='text'
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							placeholder='Write a comment...'
							className='border rounded-md p-2 flex-1 text-sm'
						/>
						<button
							onClick={handleAddComment}
							className='ml-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm'
						>
							Post
						</button>
					</div>
				</div>
			)}

			{/* Image Modal */}
			{modalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'>
					<button
						className='absolute top-5 right-5 text-white p-2'
						onClick={closeModal}
					>
						<X size={30} />
					</button>
					<button
						className='absolute left-5 text-white p-2 text-2xl'
						onClick={prevImage}
					>
						‹
					</button>
					<img
						src={post.images[modalIndex]}
						alt={`Modal image ${modalIndex + 1}`}
						className='max-h-[80vh] max-w-[90vw] object-contain rounded-md'
					/>
					<button
						className='absolute right-5 text-white p-2 text-2xl'
						onClick={nextImage}
					>
						›
					</button>
				</div>
			)}
		</div>
	);
}
