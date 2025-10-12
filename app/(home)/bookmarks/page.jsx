"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import PostCard from "../postcards/page";
import NoData from "@/components/nodata/NoData";
import { toast } from "sonner";

const BACKEND_URL =process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const BookmarksPage = () => {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user data
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/users`);
        const user = res.data.find((u) => u.email === session.user.email);
        if (user) setUserData(user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserData();
  }, [session]);

  // Fetch bookmarks
  useEffect(() => {
    if (!userData?._id) return;

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/bookmarks/${userData._id}`);
        setBookmarks(res.data || []);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userData]);

  // Remove bookmark
  const handleRemoveBookmark = async (postId) => {
    if (!userData?._id) return;
    try {
      await axios.delete(`${BACKEND_URL}/bookmarks/${userData._id}/${postId}`);
      setBookmarks((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Bookmark removed!");
    } catch (err) {
      console.error("Error removing bookmark:", err);
      toast.error(err.response?.data?.message || "Failed to remove bookmark");
    }
  };

  if (!userData || loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>

        {bookmarks.length === 0 ? (
          <NoData />
        ) : (
          <div className="flex flex-col gap-4">
            {bookmarks.map((post) => (
              <div key={post._id} className="relative">
                <PostCard
                  post={post}
                  userData={userData}
                  userName={session.user.name}
                  avatar={session.user.image}
                />
                <button
                  onClick={() => handleRemoveBookmark(post._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
