"use client";
import React, { useState, useEffect } from "react";
import { FaRegComment, FaRegHeart, FaRegBookmark, FaShare } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ExploreFeed = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  const filteredPosts = posts
    .filter((post) => {
      if (filter === "today") {
        const today = new Date();
        const postDate = new Date(post.createdAt);
        return (
          postDate.getDate() === today.getDate() &&
          postDate.getMonth() === today.getMonth() &&
          postDate.getFullYear() === today.getFullYear()
        );
      } else if (filter === "this-week") {
        const today = new Date();
        const postDate = new Date(post.createdAt);
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        return postDate >= firstDayOfWeek;
      } else if (filter === "this-month") {
        const today = new Date();
        const postDate = new Date(post.createdAt);
        return (
          postDate.getMonth() === today.getMonth() &&
          postDate.getFullYear() === today.getFullYear()
        );
      } else {
        return true;
      }
    })
    .filter((post) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        post.text.toLowerCase().includes(searchTermLower) ||
        post.userName.toLowerCase().includes(searchTermLower)
      );
    });

  return (
    <div className="w-full max-w-2xl">
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1"
          />
          <Select onValueChange={handleFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Feed */}
        {filteredPosts.map((post) => (
          <div
            key={post._id}
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
                  {post.userName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{post.text}</p>
            {post.images && post.images.length > 0 && (
              <img
                src={post.images[0]}
                alt="Post"
                className="w-full rounded-lg mb-3"
              />
            )}

            {/* Reaction Bar */}
            <div className="flex justify-around text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
              <button
                className="flex items-center gap-2 hover:text-red-500"
              >
                <FaRegHeart /> {post.likes.length}
              </button>
              <button
                className="flex items-center gap-2 hover:text-blue-500"
              >
                <FaRegComment /> {post.comments.length}
              </button>
              <button className="flex items-center gap-2 hover:text-green-500">
                <FaShare />
              </button>
              <button className="hover:text-yellow-500">
                <FaRegBookmark />
              </button>
            </div>
          </div>
        ))}
      </div>
  );
};

export default ExploreFeed;
