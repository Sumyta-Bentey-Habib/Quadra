import { NextResponse } from "next/server";
import dbconnect from "@/lib/dbconnect";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, photoUrl } = await req.json();

    const users = await dbconnect("users");
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = password ? await bcrypt.hash(password, 10) : null;

    await users.insertOne({
      name,
      email,
      password: hashed,
      photoUrl: photoUrl || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
