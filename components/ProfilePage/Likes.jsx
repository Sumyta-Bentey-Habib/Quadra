"use client";
import React, { useEffect, useState, useRef } from "react";
import { Heart, Laugh, Angry, ThumbsUp } from "lucide-react";
import Lottie from "lottie-react";
import Sad from "@/public/sad.json";
import Love from "@/public/love.json";
import Haha from "@/public/haha.json";
import Like from "@/public/like.json";
export default function Likes({ postId, currentUser }) {
     
    
  const [reactions, setReactions] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const totalReactions = reactions.length;

  const reactionTypes = [
    { type: "like", icon: <Lottie animationData={Like} loop={true}   
    style={{ width: 30, height: 30 }} />, color: "text-blue-500" },
    { type: "love", icon:<Lottie animationData={Love} loop={true}   
    style={{ width: 30, height: 30 }} />, color: "text-red-500" },
    { type: "haha", icon: <Lottie animationData={Haha} loop={true}   
    style={{ width: 30, height: 30 }} />, color: "text-yellow-400" },
    { type: "angry", icon:   <Lottie animationData={Sad} loop={true}   
    style={{ width: 30, height: 30 }} />,
     color: "text-orange-500" },
  ];

  // Fetch post reactions
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/posts/?postId=${postId}`);
        const data = await res.json();
        setReactions(data.likes || []);

        const userLike = data.likes.find((l) => l.userId === currentUser._id );
        if (userLike) setUserReaction(userLike.reaction);
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    };
    fetchLikes();
  }, [postId, currentUser]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle reaction select
  const handleReact = async (reactionType) => {
    if (loading) return;
    setLoading(true);

    const newReaction = userReaction === reactionType ? null : reactionType;

    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          userName: currentUser.name ,
          avatar: currentUser.photoUrl ,
          reaction: newReaction,      
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setReactions(updated.likes || []);
        setUserReaction(newReaction);
      } else {
        console.error("Failed to update reaction");
      }
    } catch (error) {
      console.error("Reaction error:", error);
    } finally {
      setLoading(false);
      setShowPopup(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      {/* Like button */}
      <div className="relative inline-block" ref={popupRef}>
        <button
          disabled={loading}
          onClick={() => setShowPopup((prev) => !prev)}
          className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full cursor-pointer transition font-medium 
            ${userReaction ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
            hover:bg-blue-50`}
        >
          
          <span className="text-sm  flex items-center justify-center gap-1">
            { !userReaction && <> <Lottie animationData={Like} loop={true}   
    style={{ width: 30, height: 30 }} />Like </>}
            { userReaction == "like" && <Lottie animationData={Like} loop={true}   
    style={{ width: 30, height: 30 }} />}
            { userReaction == "love" && <Lottie animationData={Love} loop={true}   
    style={{ width: 30, height: 30 }} />}
            { userReaction == "haha" && <Lottie animationData={Haha} loop={true}   
    style={{ width: 30, height: 30 }} />}
            { userReaction == "angry" && <Lottie animationData={Sad} loop={true}   
    style={{ width: 30, height: 30 }} />}
          </span>
      
        <div className="text-xs text-gray-500">  
            {userReaction && <span>({totalReactions})</span> }  
        </div>
        </button>

        {/* Popup */}
        {showPopup && (
          <div
            className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 shadow-lg flex gap-3 z-20 animate-fadeIn"
          >
            {reactionTypes.map((r) => (
              <button
                key={r.type}
                onClick={() => handleReact(r.type)}
                disabled={loading}
                className={`flex flex-col items-center cursor-pointer transition transform hover:scale-125 ${r.color}`}
              >
                {r.icon}
              </button>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
}
