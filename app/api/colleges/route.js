import { NextResponse } from "next/server";
import { getColleges, filterColleges } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const tier = searchParams.get("tier") || "";
  const country = searchParams.get("country") || "";

  const colleges = await getColleges();
  const filtered = filterColleges(colleges, { q, tier, country });

  return NextResponse.json(filtered, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
