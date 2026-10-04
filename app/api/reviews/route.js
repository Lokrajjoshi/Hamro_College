import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { collegeSlug, author, email, verification, academic, housing, placement, text } = body;

    if (!text || text.trim().length < 30) {
      return NextResponse.json({ error: "Review must be at least 30 characters." }, { status: 400 });
    }

    const id = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const sb = getSupabase();
    if (sb) {
      await sb.from("reviews").insert({
        id,
        college_slug: collegeSlug,
        author_name: author,
        author_email_hash: Buffer.from(email || "").toString("base64").slice(0, 20),
        verification_type: verification,
        verified: false,
        status: "pending",
        academic_rating: academic,
        housing_rating: housing,
        placement_rating: placement,
        review_text: text.trim(),
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ id, status: "pending" });
  } catch (err) {
    console.error("Review submission error:", err);
    return NextResponse.json({ error: "Could not submit review." }, { status: 500 });
  }
}
