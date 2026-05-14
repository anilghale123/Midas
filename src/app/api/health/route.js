import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    const dbState = state === 1 ? "connected" : "disconnected";
    return Response.json({ status: "ok", db: dbState });
  } catch (err) {
    return Response.json(
      { status: "error", db: "disconnected", error: err.message ?? String(err) },
      { status: 503 }
    );
  }
}
