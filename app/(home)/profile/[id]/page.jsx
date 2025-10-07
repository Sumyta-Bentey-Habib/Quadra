"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import EditProfileModal from "@/components/ProfilePage/EditProfileModal";
import CreatePost from "@/components/ProfilePage/CreatePost";
import PostsUi from "@/components/PostsUi/PostsUi";
import { useParams } from "next/navigation";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data by ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">User not found.</p>
      </div>
    );
  }

  // Dummy placeholders for profile completion UI
  const completedTasks = ["Verified Email", "Added Name"];
  const pendingTasks = ["Set Workplace", "Add Country"];
  const totalTasks = completedTasks.length + pendingTasks.length;
  const completionPercentage = (completedTasks.length / totalTasks) * 100;

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 min-h-screen">
        
        {/* --- Left Column (Profile Card) --- */}
        <div className="lg:col-span-2">
          <div className="lg:sticky top-4">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={user.photoUrl || "https://i.pravatar.cc/150"}
                    alt={user.name}
                    className="h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold">{user.name}</h1>
                <p className="text-sm sm:text-md text-gray-500 dark:text-gray-400 font-mono mt-1">
                  {user.email}
                </p>
              </div>

              <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700 my-6 py-4">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">{user.friends || 0}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">Friends</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">{user.posts || 0}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">Posts</p>
                </div>
              </div>

              {/* Profile Strength */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold">Profile Strength</h2>
                  <p className="text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400">
                    {Math.round(completionPercentage)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-gray-400 to-gray-700 h-2 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <ul className="text-xs sm:text-sm space-y-2">
                  {completedTasks.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" /> {item}
                    </li>
                  ))}
                  {pendingTasks.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                      <Circle size={16} className="text-gray-300 dark:text-gray-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 sm:mt-6">
                <EditProfileModal user={ user } />
              </div>
            </div>
          </div>
        </div>

        {/* --- Right Column (Feed) --- */}
        <div className="lg:col-span-3 space-y-6 sm:space-y-8">
          <CreatePost user={ user } />
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
              <label htmlFor="sort" className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                Sort by:
              </label>
              <select
                id="sort"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div>
              <PostsUi user={ user } />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
