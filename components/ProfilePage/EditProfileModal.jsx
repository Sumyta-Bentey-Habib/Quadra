"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { Camera, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const EditProfileModal = ({ user }) => {
  const [preview, setPreview] = useState(user.photoUrl || "https://i.pravatar.cc/150");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.fullName.value;
    // const password = form.password.value; // optional
    const photoFile = form.photo?.files[0];

    let photoUrl = user.photoUrl; // default to existing photo

    // Upload image to Cloudinary if a new file is selected
    if (photoFile) {
      const formData = new FormData();
      formData.append("file", photoFile);
      formData.append("upload_preset", "project_quadra"); // Cloudinary preset
      formData.append("folder", "profile_photos"); // optional folder

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dizstnwr7/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        photoUrl = data.secure_url; // Cloudinary image URL
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        alert("Image upload failed");
        return;
      }
    }

    // Update user in backend
    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photoUrl }),  // password
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        window.location.reload(); // reload to reflect changes
      } else {
        console.error("Failed to update profile");
        alert("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full cursor-pointer mt-8 py-3 bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 border border-gray-700 dark:border-gray-300 rounded-xl text-gray-200 dark:text-gray-800 font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
          <Edit size={16} /> Edit Profile
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-6">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">
            ✦ Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative group">
              <img
                src={preview}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <label
                htmlFor="photo"
                className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 transition"
              >
                <Camera size={18} className="text-gray-600 dark:text-gray-300" />
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Name Input */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            defaultValue={user.name}
            className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2 py-2 focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2 py-2 focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />

          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <DialogClose asChild>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
