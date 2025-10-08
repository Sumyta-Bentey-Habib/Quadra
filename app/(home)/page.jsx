"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";

// Replace with your actual backend URL
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [userData, setUserData] = useState([]);
 // get user info from session
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const avatar = session?.user?.image;
  

  // --- Load all posts on mount ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  // get user data from backend  using email match
  useEffect(() => {
    const res = axios
      .get(`${BACKEND_URL}/users`)
      .then((res) =>
        setUserData(res.data.find((user) => user.email === userEmail))
      )
      .catch((err) => console.log(err));
  });
  console.log(userData._id);

  // --- Create new post ---
  const handleCreatePost = async () => {
    if (!newPostText.trim())
      return alert("Please enter some text for the post.");

    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/posts`, {
        text: newPostText,

        userId: userData._id,
        userName: userName || "Anonymous",
        avatar: avatar || "https://i.pravatar.cc/100",
        images: [], // add image URLs later if needed
      });

      setPosts([res.data, ...posts]);
      setNewPostText("");
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      alert("Failed to create post. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      {/* Post Input */}
      <div className="border rounded-lg p-4 mb-6 bg-white shadow">
        <textarea
          className="w-full border rounded-md p-2 mb-3 resize-none"
          rows="3"
          placeholder="What's on your mind?"
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={handleCreatePost}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Posts Feed */}
      {posts.map((post) => (
        <div
          key={post._id}
          className="border rounded-lg p-4 mb-4 bg-white shadow"
        >
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

          {/* Post Image */}
          {post.images && post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt="Post"
              className="w-full rounded-lg mb-3"
            />
          )}

          {/* Post Actions */}
          <div className="flex items-center justify-between text-gray-600">
            <button className="flex items-center space-x-1">
              <Heart className="w-5 h-5" />{" "}
              <span>{post.likes?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-1">
              <MessageCircle className="w-5 h-5" />{" "}
              <span>{post.comments?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-1">
              <Send className="w-5 h-5" /> <span>Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
