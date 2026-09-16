import { NextResponse } from "next/server";

import { deleteSession } from "@/lib/auth/session";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      success: true,
      message: "Signed out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to sign out.",
      },
      {
        status: 500,
      }
    );
  }
}