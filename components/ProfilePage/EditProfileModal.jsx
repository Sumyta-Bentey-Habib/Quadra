// "use client";

import * as React from "react";
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
  let imgRef = null;
  let fileInputRef = null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && imgRef) {
      imgRef.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.fullName.value;
    const password = form.password.value;
    const dp = form.avatar.files[0];

    console.log({ name, password, dp });
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
              {user.avatar && (
                <img
                  ref={(el) => (imgRef = el)}
                  src={user.avatar}
                  alt="avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Camera Icon */}
              <label
                htmlFor="avatar"
                className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 transition"
              >
                <Camera size={18} className="text-gray-600 dark:text-gray-300" />
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  ref={(el) => (fileInputRef = el)}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              defaultValue={user.name}
              className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2 py-2 focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2 py-2 focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <DialogClose asChild>
              <Button
                className="cursor-pointer bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white transition-all"
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                className="cursor-pointer bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:from-gray-100 dark:via-gray-200 dark:to-gray-400 border border-gray-700 dark:border-gray-300 text-white dark:text-gray-900 font-semibold rounded-lg px-6 py-2 hover:bg-gray-800 dark:hover:bg-gray-300 hover:shadow-md transition-all"
                size="sm"
                type="submit"
              >
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
