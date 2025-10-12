"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = "http://localhost:5000";

const Comments = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState({});
  const [replyText, setReplyText] = useState({});

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/posts/${postId}/comments`);
      setComments(res.data || []);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load comments");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`${BACKEND_URL}/posts/${postId}/comments`, {
        userId: currentUser._id,
        userName: currentUser.name || currentUser.userName,
        avatar: currentUser.photoUrl,
        text: commentText,
      });

      const newComment = res.data.comment || res.data;
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  const handleAddReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text?.trim()) return;

    try {
      const res = await axios.post(
        `${BACKEND_URL}/posts/${postId}/comments/${commentId}/replies`,
        {
          userId: currentUser._id,
          userName: currentUser.name || currentUser.userName,
          avatar: currentUser.photoUrl,
          text,
        }
      );

      const newReply = res.data.reply || res.data;
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      );

      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to add reply");
    }
  };

  return (
    <div>
      <button
        onClick={fetchComments}
        className="text-md cursor-pointer "
      >
        Comments
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
                        bg-white/40 dark:bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100
                          rounded-lg w-full max-w-lg p-4 relative max-h-[80vh] overflow-y-auto shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Comments</h2>

            {/* Comment List */}
            {comments.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No comments yet.</p>
            )}
            {comments.map((c, cIdx) => (
              <div key={c._id || `comment-${cIdx}`} className="flex flex-col mb-3">
                <div className="flex items-start">
                  <img
                    src={c.avatar || "https://i.pravatar.cc/100"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2 border border-gray-300 dark:border-gray-600"
                  />
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex-1">
                    <p className="text-sm font-semibold">{c.userName}</p>
                    <p className="text-sm">{c.text}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-300">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : "Just now"}
                    </p>

                    {/* Reply Button */}
                    <button
                      className="text-xs cursor-pointer text-blue-600 dark:text-blue-400 mt-1 hover:underline"
                      onClick={() =>
                        setShowReplyInput((prev) => ({ ...prev, [c._id]: !prev[c._id] }))
                      }
                    >
                      Reply
                    </button>

                    {/* Reply Input */}
                    {showReplyInput[c._id] && (
                      <div className="flex items-center mt-1">
                        <input
                          type="text"
                          value={replyText[c._id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({ ...prev, [c._id]: e.target.value }))
                          }
                          placeholder="Write a reply..."
                          className="border rounded-md p-1 flex-1 text-sm bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-500"
                        />
                        <button
                          className="ml-2 cursor-pointer bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded-md text-sm"
                          onClick={() => handleAddReply(c._id)}
                        >
                          Reply
                        </button>
                      </div>
                    )}

                    {/* Replies */}
                    {c.replies?.map((r, rIdx) => (
                      <div
                        key={r._id || `reply-${rIdx}`}
                        className="flex items-start ml-10 mt-1"
                      >
                        <img
                          src={r.avatar || "https://i.pravatar.cc/100"}
                          alt="avatar"
                          className="w-6 h-6 rounded-full mr-2 border border-gray-300 dark:border-gray-500"
                        />
                        <div className="bg-gray-200 dark:bg-gray-600 p-2 rounded-lg flex-1">
                          <p className="text-sm font-semibold">{r.userName}</p>
                          <p className="text-sm">{r.text}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-300">
                            {r.createdAt
                              ? new Date(r.createdAt).toLocaleString()
                              : "Just now"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Comment */}
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="border rounded-md p-2 flex-1 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-500"
              />
              <button
                onClick={handleAddComment}
                className="ml-2 cursor-pointer bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
