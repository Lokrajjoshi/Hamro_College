// Server-side data access. Tries Supabase first; falls back to local data
// so the site always renders (useful for local dev and first deploys).
import { getSupabase } from "./supabase";
import { rowToCollege, rowToReview } from "./mapping";
import { COLLEGES } from "@/data/colleges";
import { SEED_REVIEWS } from "@/data/reviews";

export async function getColleges() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("colleges").select("*").order("name");
      if (!error && data && data.length > 0) return data.map(rowToCollege);
    } catch {
      // fall through to local data
    }
  }
  return COLLEGES;
}

export async function getCollegeBySlug(slug) {
  const colleges = await getColleges();
  return colleges.find((c) => c.slug === slug) || null;
}

export async function getReviews(slug) {
  const seed = SEED_REVIEWS.filter((r) => r.collegeSlug === slug);
  const sb = getSupabase();
  if (!sb) return seed;
  try {
    const { data, error } = await sb
      .from("reviews")
      .select("*")
      .eq("college_slug", slug)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error || !data) return seed;
    return [...data.map(rowToReview), ...seed];
  } catch {
    return seed;
  }
}

export function filterColleges(colleges, { q = "", tier = "", country = "" } = {}) {
  const query = q.trim().toLowerCase();
  return colleges.filter((c) => {
    if (tier && c.tier !== tier) return false;
    if (country && c.country !== country) return false;
    if (!query) return true;
    return [c.name, c.shortName, c.city, c.country, c.affiliation, ...(c.courses || []).map((x) => x.title)]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}
