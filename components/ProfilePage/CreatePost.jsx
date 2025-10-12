"use client";

import React, { useState, useRef } from "react";
import { Image, Video, Music, X, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Cloudinary Image Upload
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "project_quadra");

  const res = await fetch("https://api.cloudinary.com/v1_1/dizstnwr7/image/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image should be within 2MB");
  }

  const data = await res.json();
  return data.secure_url;
};

const CreatePost = ({ user, setUpdatePostUi, updatePostUi, updateUi, setUpdateUi }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Getting current user data
  const { data: session } = useSession();
  const us = session?.user;

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e) => {
    if (e.target.files) {
      setSelectedImages((prev) => [...prev, ...Array.from(e.target.files)]);
      toast.success(`${e.target.files.length} image(s) selected.`, { position: "top-center" });
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    toast.info("Image removed", { position: "top-center" });
  };

  // Handle Submit with Cloudinary
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const text = form.postText.value.trim();

    if (!text && selectedImages.length === 0) {
      toast.warning("Please add text or an image before posting.", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating post...", { position: "top-center" });

    try {
      const uploadedImageUrls = [];
      for (const file of selectedImages) {
        const imageUrl = await uploadToCloudinary(file);
        uploadedImageUrls.push(imageUrl);
      }

      const newPost = {
        userId: us?.id,
        userName: us?.name || "Anonymous",
        avatar:
          us?.image ||
          "https://res.cloudinary.com/dizstnwr7/image/upload/v1759867578/profile_photos/aoizjrhbuerkt3o8gzdp.png",
        text,
        images: uploadedImageUrls,
      };

      // Send to backend
      const res = await fetch("https://quadra-server.onrender.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error("Failed to create post");

      const createdPost = await res.json();
      console.log("Post created:", createdPost);
      setUpdatePostUi(!updatePostUi);
      setUpdateUi(!updateUi)

      // Clear form
      form.reset();
      setSelectedImages([]);

      toast.success("Post created successfully!", { position: "top-center" });
    } catch (error) {
      console.error(error);
      toast.error("Error creating post. Please try again.", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <form
      className="bg-white dark:bg-black p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md"
      onSubmit={handleSubmit}
    >
      {/* Post Input */}
      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={
            user.photoUrl ||
            "https://res.cloudinary.com/dizstnwr7/image/upload/v1759867578/profile_photos/aoizjrhbuerkt3o8gzdp.png"
          }
          alt="avatar"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover mt-1 border border-gray-200 dark:border-gray-600"
        />
        <textarea
          name="postText"
          required
          placeholder="Share your thoughts..."
          className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 text-gray-800 dark:text-gray-200 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none resize-none"
          rows={3}
        ></textarea>
      </div>

      {/* Media Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 pl-12 sm:pl-16 gap-3 sm:gap-0">
        <div className="flex gap-3 sm:gap-4 text-gray-500 dark:text-gray-400 flex-wrap">
          {/* Photo Button */}
          <button
            type="button"
            onClick={openFilePicker}
            className="flex items-center gap-1 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <Image size={20} /> Photos
          </button>

          {/* Video modal */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                <Video size={20} /> Videos
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm p-4 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                  <ShieldAlert className="text-orange-400" /> Under Construction
                </DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                The video upload feature is currently under construction. Stay tuned!
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="mt-2 cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sound modal */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                <Music size={20} /> Sounds
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm p-4 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                  <ShieldAlert className="text-orange-400" /> Under Construction
                </DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                The sound upload feature is currently under construction. Stay tuned!
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="mt-2 cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`cursor-pointer ${
            isSubmitting
              ? "bg-gray-400 cursor-wait"
              : "bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 hover:scale-105 hover:shadow-md"
          } border border-gray-300 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300  dark:border-gray-300   dark:text-gray-800 transition-all duration-300 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg`}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Live Preview */}
      {selectedImages.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {selectedImages.map((file, idx) => (
            <div
              key={idx}
              className="relative w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-full max-h-[500px] object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 cursor-pointer bg-white dark:bg-gray-800 rounded-full p-1 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X size={16} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default CreatePost;
