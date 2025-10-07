import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { width, height } = params;

 
  const url = `https://via.placeholder.com/${width}x${height}`;
  return NextResponse.redirect(url);
}
