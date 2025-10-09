"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import PostCard from "./postcards/page";
 // create this below

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [userData, setUserData] = useState([]);

  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const avatar = session?.user?.image;

  // --- Load all posts ---
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

  // --- Get user data from backend ---
  useEffect(() => {
    if (!userEmail) return;
    axios
      .get(`${BACKEND_URL}/users`)
      .then((res) => {
        const user = res.data.find((u) => u.email === userEmail);
        setUserData(user);
      })
      .catch((err) => console.log(err));
  }, [userEmail]);

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
        images: [],
      });
      setPosts([res.data, ...posts]);
      setNewPostText("");
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
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
        <PostCard
          key={post._id}
          post={post}
          userData={userData}
          userName={userName}
          avatar={avatar}
          setPosts={setPosts}
        />
      ))}
    </div>
  );
}
