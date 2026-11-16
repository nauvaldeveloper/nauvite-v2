import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export const REVIEWS_TAG = "reviews";

/** Minimal ulasan sebelum bagian ulasan tampil di landing page. */
export const MIN_REVIEWS_SHOWN = 3;

export type PublicReview = { id: string; coupleName: string; city: string | null; rating: number; message: string };

/** Ulasan yang disetujui admin dan diizinkan tampil oleh kliennya (dijaga RLS). */
export async function getPublicReviews(limit = 6): Promise<PublicReview[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(REVIEWS_TAG);

  const { data } = await createPublicClient()
    .from("reviews")
    .select("id, couple_name, city, rating, message")
    .eq("status", "approved")
    .eq("consent", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    coupleName: r.couple_name,
    city: r.city,
    rating: r.rating,
    message: r.message,
  }));
}
