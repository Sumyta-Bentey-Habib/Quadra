"use client";

import React, { useState } from "react";
import { toast } from "sonner";

const EditPostModal = ({ post, onClose, onUpdate }) => {
  const [text, setText] = useState(post.text);
  // already uploaded
  const [existingImages, setExistingImages] = useState(post.images || []); 
  // newly selected files
  const [newFiles, setNewFiles] = useState([]); 
  const [previews, setPreviews] = useState(post.images || []); 
  const [loading, setLoading] = useState(false);

  // Handle new file selection (for preview)
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Please upload an image!");

    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => [...prev, previewUrl]);
    setNewFiles((prev) => [...prev, file]);
  };

  // Removing image (existing or new)
  const handleRemoveImage = (img) => {
    if (existingImages.includes(img)) {
      setExistingImages((prev) => prev.filter((i) => i !== img));
      setPreviews((prev) => prev.filter((i) => i !== img));
    } else {
      const index = previews.indexOf(img);
      if (index !== -1) {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((i) => i !== img));
      }
    }
  };

  // Upload new images to Cloudinary
  const uploadNewFiles = async () => {
    const uploadedUrls = [];

    for (const file of newFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "project_quadra");

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dizstnwr7/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
        else toast.error("Failed to Upload image.", { position: "top-center" });
      } catch (err) {
        console.error("Error uploading image:", err);
        toast.error(err.message || "Error uploading image", { position: "top-center" });
      }
    }

    return uploadedUrls;
  };

  // Update post
  const handleUpdate = async () => {
    if (!text.trim()) return toast("Post text cannot be empty!");
    setLoading(true);

    try {
      const uploadedUrls = await uploadNewFiles();
      const finalImages = [...existingImages, ...uploadedUrls];

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, images: finalImages }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        onUpdate(updatedPost);
        toast.success("Post updated successfully!", { position: "top-center" });
        onClose();
      } else {
        toast.error("Failed to update post.", { position: "top-center" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating post.", { position: "top-center" });
    } finally {
      setLoading(false);
      setNewFiles([]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[90%] max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Edit Post
        </h2>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500"
          placeholder="What's on your mind?"
        />

        {/* Images */}
        <div className="mt-3 space-y-2">
          <label
            htmlFor="imageUpload"
            className={`inline-block ${
              loading ? "bg-gray-400" : "bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 border border-gray-700 dark:border-gray-300 rounded-md text-gray-200 dark:text-gray-800 font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
            } text-white text-sm px-4 py-2 rounded-md cursor-pointer transition`}
          >
            {loading ? "Uploading..." : "Add Image"}
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={loading}
          />

          {/* Preview */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {previews.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`preview-${idx}`}
                    className="rounded-lg object-cover w-full h-32 border border-gray-300 dark:border-gray-700"
                  />
                  <button
                    onClick={() => handleRemoveImage(img)}
                    className="absolute top-1 cursor-pointer right-1 bg-black/70 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-800 dark:text-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 rounded-md cursor-pointer bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 border border-gray-700 dark:border-gray-300  text-gray-200 dark:text-gray-800 font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
