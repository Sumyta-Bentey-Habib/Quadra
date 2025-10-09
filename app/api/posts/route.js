
import { NextResponse } from "next/server";

// Dummy data for posts
let posts = [
  {
    _id: "1",
    text: "This is the first post!",
    author: "John Doe",
    avatar: "https://i.pravatar.cc/40?img=4",
    name: "John Doe",
    userName: "@john",
    createdAt: "2h",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=60",
    likes: 10,
    comments: ["This is a great post!", "I agree!"],
    shares: 5,
  },
  {
    _id: "2",
    text: "Just setting up my Quadra account!",
    author: "Jane Smith",
    avatar: "https://i.pravatar.cc/40?img=5",
    name: "Jane Smith",
    userName: "@jane",
    createdAt: "3h",
    image: null,
    likes: 15,
    comments: [],
    shares: 2,
  },
];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request) {
  const { text } = await request.json();
  const newPost = {
    _id: (posts.length + 1).toString(),
    text,
    author: "New User",
    avatar: "https://i.pravatar.cc/40?img=6",
    name: "New User",
    userName: "@newuser",
    createdAt: "1m",
    image: null,
    likes: 0,
    comments: [],
    shares: 0,
  };
  posts = [newPost, ...posts];
  return NextResponse.json(newPost);
}
