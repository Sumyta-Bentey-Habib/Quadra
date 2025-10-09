"use client";
import React, { useState } from "react";
import { TrendingUp, UserPlus, Sparkles, Hash, Users, Calendar } from "lucide-react";

const trendingTopics = [
  { tag: "WebDevelopment", posts: "12.5K", trend: "+15%" },
  { tag: "AI", posts: "45.2K", trend: "+28%" },
  { tag: "NextJS", posts: "8.3K", trend: "+12%" },
  { tag: "OpenSource", posts: "22.1K", trend: "+9%" },
  { tag: "Design", posts: "18.7K", trend: "+21%" },
];

const suggestedUsers = [
  { id: 1, name: "Sarah Chen", username: "@sarahdev", avatar: "/api/placeholder/40/40", followers: "12K", bio: "Full-stack developer" },
  { id: 2, name: "Alex Rivera", username: "@alexcodes", avatar: "/api/placeholder/40/40", followers: "8.5K", bio: "UI/UX Designer" },
  { id: 3, name: "Maya Patel", username: "@mayatech", avatar: "/api/placeholder/40/40", followers: "15K", bio: "Tech enthusiast" },
];

const upcomingEvents = [
  { title: "Web Summit 2025", date: "Oct 15", attendees: "2.3K" },
  { title: "React Conf", date: "Oct 22", attendees: "1.8K" },
];


export default function RightSidebarComponets() {
  const [followedUsers, setFollowedUsers] = useState([]);

  const handleFollow = (userId) => {
    setFollowedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("");
  };

  return (
    <div className="sticky right-0 top-0 h-screen w-80 overflow-y-auto border-l border-gray-200  p-6 max-xl:hidden">
      <div className="space-y-6">
        {/* Trending Topics Section */}
        <div className="rounded-xl border border-gray-200 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 p-2">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Trending Now</h3>
            </div>
            <p className="text-sm text-gray-500">What&apos;s hot in your network</p>
          </div>
          <div className="px-4 pb-4 space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="group flex cursor-pointer items-center justify-between rounded-lg p-2 transition-all hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                      {topic.tag}
                    </p>
                    <p className="text-xs text-gray-500">{topic.posts} posts</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  {topic.trend}
                </span>
              </div>
            ))}
            <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg py-2 transition-colors">
              Show more trends
            </button>
          </div>
        </div>

        {/* Suggested Users Section */}
        <div className="rounded-xl border border-gray-200 bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-2">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold ">People to Follow</h3>
            </div>
            <p className="text-sm text-gray-500">Based on your interests</p>
          </div>
          <div className="px-4 pb-4 space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="group">
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 rounded-full ring-2 ring-transparent group-hover:ring-blue-500 transition-all overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center text-white text-sm font-medium">
                      {getInitials(user.name)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.username}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{user.bio}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{user.followers} followers</span>
                    </div>
                  </div>
                  <button
                    className={`h-8 px-3 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                      followedUsers.includes(user.id)
                        ? "bg-gray-100 hover:bg-background text-gray-700"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    onClick={() => handleFollow(user.id)}
                  >
                    {followedUsers.includes(user.id) ? (
                      "Following"
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4 h-px bg-background" />
              </div>
            ))}
            <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg py-2 transition-colors">
              See all suggestions
            </button>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
            </div>
          </div>
          <div className="px-4 pb-4 space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-lg bg-background p-3 shadow-sm hover:shadow-md transition-all"
              >
                <p className="font-semibold text-sm">{event.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="inline-flex items-center rounded-md border border-gray-300 bg-background px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {event.date}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>{event.attendees} interested</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="px-2 text-xs text-gray-500">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-gray-700 transition-colors">About</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Help</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
          </div>
          <p className="mt-2 text-gray-400">© 2025 YourSocial</p>
        </div>
      </div>
    </div>
  );
};


