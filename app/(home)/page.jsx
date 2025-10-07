"use client";
import React, { useState } from "react";
import {
  FaRegComment,
  FaRegHeart,
  FaRegBookmark,
  FaShare,
  FaUserCircle,
  FaImage,
  FaTimes,
  FaPlusCircle,
  FaPaperPlane,
} from "react-icons/fa";

const storiesData = [
  {
    id: 1,
    name: "Sarah",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=60",
    likes: 10,
  },
  {
    id: 2,
    name: "Alex",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=60",
    likes: 5,
  },
  {
    id: 3,
    name: "Nina",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=60",
    likes: 8,
  },
  {
    id: 4,
    name: "Leo",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60",
    likes: 3,
  },
];

const postsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarah_j",
    time: "2h",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=100&q=60",
    text: "Just tried this amazing new recipe! 🍋✨ #foodie #cooking #homemade",
    image:
      "https://images.unsplash.com/photo-1601050690597-3b22e2a07c56?auto=format&fit=crop&w=800&q=60",
    likes: 142,
    comments: ["Nice post!", "Love this 😍", "Looks awesome!"],
    shares: 8,
  },
  {
    id: 2,
    name: "Alex Designer",
    username: "@alex_design",
    time: "6h",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=100&q=60",
    text: "Working on some exciting new designs! 🌸 What do you think?",
    image:
      "https://images.unsplash.com/photo-1603570417035-7c8cc4e3e66e?auto=format&fit=crop&w=800&q=60",
    likes: 67,
    comments: ["Looks great!", "Can't wait to see more!"],
    shares: 3,
  },
];

const Home = () => {
  const [stories, setStories] = useState(storiesData);
  const [posts, setPosts] = useState(postsData);
  const [selectedStory, setSelectedStory] = useState(null);
  const [addStoryOpen, setAddStoryOpen] = useState(false);
  const [commentModalPost, setCommentModalPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  const togglePostLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const toggleStoryLike = (storyId) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, likes: s.likes + 1 } : s))
    );
  };

  const handleAddComment = () => {
    if (commentText.trim() === "" || !commentModalPost) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === commentModalPost.id
          ? { ...p, comments: [...p.comments, commentText] }
          : p
      )
    );
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0D0D0D] text-gray-800 dark:text-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Create Post */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-md p-4 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <FaUserCircle className="text-4xl text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="What's on your mind?"
              className="flex-1 bg-gray-100 dark:bg-[#0D0D0D] text-gray-700 dark:text-gray-200 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <FaImage /> Photo/Video
            </button>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition">
              Post
            </button>
          </div>
        </div>

        {/* Stories */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <div
            onClick={() => setAddStoryOpen(true)}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-[#1A1A1A] flex items-center justify-center border-2 border-blue-500">
              <FaPlusCircle className="text-blue-500 text-2xl" />
            </div>
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Add Story
            </p>
          </div>

          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border-2 border-blue-500 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                {story.name}
              </p>
            </div>
          ))}
        </div>

        {/* Feed */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={post.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-black dark:text-white">
                  {post.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.username} • {post.time}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{post.text}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full rounded-lg mb-3"
              />
            )}

            {/* Reaction Bar */}
            <div className="flex justify-around text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
              <button
                className="flex items-center gap-2 hover:text-red-500"
                onClick={() => togglePostLike(post.id)}
              >
                <FaRegHeart /> {post.likes}
              </button>
              <button
                className="flex items-center gap-2 hover:text-blue-500"
                onClick={() => setCommentModalPost(post)}
              >
                <FaRegComment /> {post.comments.length}
              </button>
              <button className="flex items-center gap-2 hover:text-green-500">
                <FaShare /> {post.shares}
              </button>
              <button className="hover:text-yellow-500">
                <FaRegBookmark />
              </button>
            </div>
          </div>
        ))}

        {/* Add Story Modal */}
        {addStoryOpen && (
          <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 p-4">
            <div className="relative bg-white dark:bg-[#1A1A1A] p-6 rounded-lg w-full max-w-sm text-center border border-gray-200 dark:border-gray-700">
              <button
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
                onClick={() => setAddStoryOpen(false)}
              >
                <FaTimes />
              </button>
              <FaImage className="text-5xl text-blue-400 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Upload your story photo
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Choose File
              </button>
            </div>
          </div>
        )}

        {/* Story Modal */}
        {selectedStory && (
          <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
            <div className="relative">
              <button
                className="absolute -top-8 right-2 text-white text-2xl"
                onClick={() => setSelectedStory(null)}
              >
                <FaTimes />
              </button>
              <img
                src={selectedStory.image}
                alt={selectedStory.name}
                className="max-h-[70vh] rounded-lg mb-4"
              />
            </div>
            <div className="flex justify-around w-full max-w-md text-gray-100 border-t border-gray-600 pt-3">
              <button
                className="flex items-center gap-2 hover:text-red-400"
                onClick={() => toggleStoryLike(selectedStory.id)}
              >
                <FaRegHeart /> {selectedStory.likes}
              </button>
              <button className="flex items-center gap-2 hover:text-blue-400">
                <FaRegComment /> Comment
              </button>
              <button className="flex items-center gap-2 hover:text-green-400">
                <FaShare /> Share
              </button>
            </div>
          </div>
        )}

        {/* Comment Modal */}
        {commentModalPost && (
          <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
            <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-t-2xl p-4 relative border border-gray-200 dark:border-gray-700 shadow-xl">
              <button
                onClick={() => setCommentModalPost(null)}
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 transition"
              >
                <FaTimes size={18} />
              </button>
              <h2 className="font-semibold text-lg mb-3 text-center">
                Comments for {commentModalPost.name}
              </h2>

              <div className="max-h-64 overflow-y-auto mb-3 space-y-2">
                {commentModalPost.comments.map((comment, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 dark:bg-[#0D0D0D] p-2 rounded-md text-sm text-gray-800 dark:text-gray-200"
                  >
                    {comment}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#0D0D0D] rounded-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddComment}
                  className="text-blue-600 hover:text-blue-700 text-xl"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
