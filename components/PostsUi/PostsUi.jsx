"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Feather,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { useSession } from "next-auth/react";
import EditPostModal from "../ProfilePage/EditPostModal";


const PostsUi = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const menuRefs = useRef({});
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch posts
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
  }, [userId]);
  console.log(userId)

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        Object.values(menuRefs.current).every(
          (ref) => ref && !ref.contains(event.target)
        )
      ) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Delete post
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Open edit modal
  const handleEditClick = (post) => {
    setEditingPost(post);
  };

  // Update post after editing
  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    setEditingPost(null);
  };

  if (!posts.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md text-center">
        <div className="flex flex-col justify-center items-center p-8 sm:p-12 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-lg">
          <Feather size={40} className="text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold">The Canvas is Empty</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
            Create your first post and share your story.
          </p>
        </div>
      </div>
    );
  }
  console.log(posts)

  return (
    <>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.photoUrl ||
                    "https://res.cloudinary.com/dizstnwr7/image/upload/v1759867578/profile_photos/aoizjrhbuerkt3o8gzdp.png"
                  }
                  alt={post.user}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {post.userName}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Menu */}
              <div className="relative" ref={(el) => (menuRefs.current[post._id] = el)}>
                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === post._id ? null : post._id)
                  }
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                >
                  <MoreHorizontal className="cursor-pointer" size={20} />
                </button>

                {menuOpen === post._id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                    <button
                      className="block cursor-pointer w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleEditClick(post)}
                    >
                      Edit Post
                    </button>
                    <button
                      className="block cursor-pointer w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <p className="text-gray-700 dark:text-gray-300 mb-4">{post.text}</p>

            {post.images?.length > 0 && (
              <div
                className={`${
                  post.images.length > 1
                    ? "grid grid-cols-1 sm:grid-cols-2"
                    : "flex"
                } gap-3 rounded-lg overflow-hidden`}
              >
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`post-${idx}`}
                    className="rounded-lg object-cover w-full max-h-[400px] border border-gray-200 dark:border-gray-600"
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
              <button className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition">
                <Heart size={18} /> <span>Like</span>
              </button>
              <button className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition">
                <MessageCircle size={18} /> <span>Comment</span>
              </button>
              <button className="flex items-center gap-1 cursor-pointer hover:text-green-500 transition">
                <Share2 size={18} /> <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={handleUpdatePost}
        />
      )}
    </>
  );
};

export default PostsUi;
