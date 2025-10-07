import { NextResponse } from "next/server";
import dbconnect from "@/lib/dbconnect";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, photoUrl } = await req.json();

    const users = await dbconnect("users");

    // Check if user already exists
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      photoUrl: photoUrl || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, userId: result.insertedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
