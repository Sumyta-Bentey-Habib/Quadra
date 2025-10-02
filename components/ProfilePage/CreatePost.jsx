// "use client";

import React, { useState, useRef } from "react";
import { Image, Video, Music, X, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CreatePost = ({ user }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e) => {
    if (e.target.files) {
      setSelectedImages((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const text = form.postText.value;

    console.log({
      text,
      images: selectedImages,
    });

    // Clear form
    form.reset();
    setSelectedImages([]);
  };

  return (
    <form
      className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-md"
      onSubmit={handleSubmit}
    >
      {/* Post Input */}
      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={user.avatar}
          alt="avatar"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover mt-1 border border-gray-200"
        />
        <textarea
          name="postText"
          placeholder="Share your thoughts..."
          className="w-full bg-gray-100 border border-gray-300 focus:border-gray-500 text-gray-800 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none resize-none"
          rows={3}
        ></textarea>
      </div>

      {/* Media Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 pl-12 sm:pl-16 gap-3 sm:gap-0">
        <div className="flex gap-3 sm:gap-4 text-gray-500 flex-wrap">
          <button
            type="button"
            onClick={openFilePicker}
            className="flex items-center gap-1 cursor-pointer hover:text-gray-800 transition-colors duration-200"
          >
            <Image size={20} /> Photos
          </button>

          {/* Video Button triggers modal */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 cursor-pointer hover:text-gray-800 transition-colors duration-200">
                <Video size={20} /> Videos
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm p-4 rounded-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <ShieldAlert className="text-orange-400" /> Under Construction
                </DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 mt-2">
                The Video upload feature is currently under construction. Stay tuned!
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="mt-2 bg-gray-200 cursor-pointer text-gray-800 hover:bg-gray-300">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Music Button triggers modal */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 cursor-pointer hover:text-gray-800 transition-colors duration-200">
                <Music size={20} /> Sounds
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm p-4 rounded-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <ShieldAlert className="text-orange-400" /> Under Construction
                </DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 mt-2">
                The Sound upload feature is currently under construction. Stay tuned!
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="mt-2 bg-gray-200 cursor-pointer text-gray-800 hover:bg-gray-300">
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
          className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 border border-gray-300 hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer text-white font-semibold px-4 sm:px-6 py-2 rounded-lg"
        >
          Post
        </button>
      </div>

      {/* Live Post Preview */}
      {selectedImages.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {selectedImages.map((file, idx) => (
            <div
              key={idx}
              className="relative w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-full max-h-[500px] object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default CreatePost;
