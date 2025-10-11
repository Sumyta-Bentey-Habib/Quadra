"use client";
import React, { useEffect, useState } from "react";
import { Sparkles, MessageSquare } from "lucide-react";

export default function RightSidebarComponents() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState(5);
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, postsRes] = await Promise.all([
          fetch("http://localhost:5000/users"),
          fetch("http://localhost:5000/posts"),
        ]);
        const usersData = await usersRes.json();
        const postsData = await postsRes.json();
        setUsers(usersData);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleFollow = (userId) => {
    setFollowedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("") : "?";

  return (
    <div className="sticky top-0 w-80 border-l border-gray-200 p-6 max-xl:hidden overflow-x-hidden">
      <div className="space-y-6">

        {/* Suggested Users */}
        <div className="rounded-xl border border-gray-200 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-4 pb-3 flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-2">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold">People to Follow</h3>
          </div>
          <div className="px-4 pb-4 space-y-4">
            {users.slice(0, visibleUsers).map((user) => (
              <div key={user._id} className="group flex items-start gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                  <img
                    src={user.photoUrl || "https://i.pravatar.cc/100"}
                    alt={user.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center text-white text-sm font-medium">
                    {getInitials(user.name)}
                  </div>
                </div>
                <div className="flex-1 min-w-0 break-words">
                  <p className="font-semibold text-sm truncate group-hover:text-blue-600">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  className={`h-8 px-3 text-xs font-medium rounded-md transition-all ${
                    followedUsers.includes(user._id)
                      ? "bg-gray-100 text-gray-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={() => handleFollow(user._id)}
                >
                  {followedUsers.includes(user._id) ? "Following" : "Follow"}
                </button>
              </div>
            ))}
            {visibleUsers < users.length && (
              <button
                onClick={() => setVisibleUsers((prev) => prev + 5)}
                className="text-blue-600 text-sm font-medium hover:underline mt-2"
              >
                Show more
              </button>
            )}
          </div>
        </div>

        {/* Latest Posts */}
        <div className="rounded-xl border border-gray-200 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-4 pb-3 flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 p-2">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Latest Posts</h3>
          </div>
          <div className="px-4 pb-4 space-y-3">
            {posts.slice(0, visiblePosts).map((post) => (
              <div
                key={post._id}
                className="rounded-lg bg-background p-3 hover:bg-gray-50 transition-all cursor-pointer border border-gray-100 break-words"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={post.avatar || "https://i.pravatar.cc/40"}
                    alt={post.userName}
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="text-sm font-medium text-gray-800">{post.userName}</p>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{post.text || "📸 Shared a post"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {visiblePosts < posts.length && (
              <button
                onClick={() => setVisiblePosts((prev) => prev + 5)}
                className="text-blue-600 text-sm font-medium hover:underline mt-2"
              >
                Show more
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-2 text-xs text-gray-500">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="/terms" className="hover:text-gray-700">Terms</a>
            <a href="/privacy" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Help</a>
            <a href="#" className="hover:text-gray-700">About</a>
          </div>
          <p className="mt-2 text-gray-400">© 2025 Quadra</p>
        </div>
      </div>
    </div>
  );
}
