"use client";

import React, { useEffect, useState, useRef } from "react";
import { Feather, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import EditPostModal from "../ProfilePage/EditPostModal";
import Likes from "../ProfilePage/Likes";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Comments from "../ProfilePage/Comments";

const PostsUi = ({ user, updatePostUi, updateUi, setUpdateUi }) => {
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const menuRefs = useRef({});
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts?userId=${userId}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast.error("Failed to load posts.", { position: "top-center" });
      }
    };
    fetchPosts();
  }, [userId, updatePostUi]);

  // Delete post
  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${postToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
        setUpdateUi(!updateUi)
        toast.success("Post deleted successfully!", { position: "top-center" });
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to delete post.", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post.", { position: "top-center" });
    } finally {
      setPostToDelete(null);
    }
  };

  // Edit handlers
  const handleEditClick = (post) => setEditingPost(post);
  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
    setEditingPost(null);
  };

  if (!posts.length) {
    return (
      <div className="bg-white dark:bg-black p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md text-center">
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

  return (
    <>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="relative bg-white dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
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
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{post.userName}</h4>
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
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-black border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                    <button
                      className="block cursor-pointer w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleEditClick(post)}
                    >
                      Edit Post
                    </button>

                    {/* Delete with AlertDialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="block w-full text-left px-4 py-2 cursor-pointer text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setPostToDelete(post)}
                        >
                          Delete Post
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your post will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDelete} className="cursor-pointer">
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
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
              <Likes currentUser={user} postId={post._id} />
              <div className="flex items-center  hover:text-blue-500 transition">
                <Comments postId={post._id} currentUser={user}/>
              </div>
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
