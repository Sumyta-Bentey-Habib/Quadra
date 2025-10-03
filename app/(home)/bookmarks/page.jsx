"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookmarkIcon } from "lucide-react";


const BookmarksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookmarkIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Bookmarks</h1>
              <p className="text-muted-foreground">6 bookmarks</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Bookmark
            </Button>
          </div>
        </div>

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">WebDevelopment</h3>
            <p className="text-sm text-muted-foreground">
              WebDevelopment is a comprehensive resource for web developers.
            </p>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">NextJS</h3>
            <p className="text-sm text-muted-foreground">
              NextJS is a React framework for building server-side rendered applications.
            </p>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">MongoDB</h3>
            <p className="text-sm text-muted-foreground">NoSQL database for modern applications</p>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">ReactJs</h3>
            <p className="text-sm text-muted-foreground">A JavaScript library for building user interfaces</p>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">Tailwind CSS</h3>
            <p className="text-sm text-muted-foreground">Utility-first CSS framework</p>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">Tailwind CSS</h3>
            <p className="text-sm text-muted-foreground">Utility-first CSS framework</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
