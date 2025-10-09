"use client";
import React, { useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Send } from "lucide-react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function PostCard({ post, userData, userName, avatar, setPosts }) {
  const [commentText, setCommentText] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

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
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow">
      {/* Post Header */}
      <div className="flex items-center mb-3">
        <img
          src={post.avatar || "https://i.pravatar.cc/100"}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{post.userName || "Anonymous"}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Post Text */}
      {post.text && <p className="mb-3">{post.text}</p>}

      {/* Post Actions */}
      <div className="flex items-center justify-between text-gray-600">
        <button className="flex items-center space-x-1">
          <Heart className="w-5 h-5" /> <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() =>
            commentsVisible ? setCommentsVisible(false) : fetchComments()
          }
          className="flex items-center space-x-1"
        >
          <MessageCircle className="w-5 h-5" />{" "}
          <span>{comments?.length || 0}</span>
        </button>

        <button className="flex items-center space-x-1">
          <Send className="w-5 h-5" /> <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      {commentsVisible && (
        <div className="mt-4 border-t pt-3">
          {comments.length === 0 && (
            <p className="text-sm text-gray-500 mb-2">No comments yet.</p>
          )}
          {comments.map((c, i) => (
            <div key={i} className="flex items-start mb-3">
              <img
                src={c.avatar || "https://i.pravatar.cc/100"}
                alt="avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="bg-gray-100 p-2 rounded-lg flex-1">
                <p className="text-sm font-semibold">{c.userName}</p>
                <p className="text-sm">{c.text}</p>
                <p className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="border rounded-md p-2 flex-1 text-sm"
            />
            <button
              onClick={handleAddComment}
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
