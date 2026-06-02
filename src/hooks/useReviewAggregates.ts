import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RatingAgg {
  rating: number;
  reviewCount: number;
}

/**
 * Loads aggregate rating + review count for many reviewable ids.
 * Falls back to `fallback[id]` when no reviews exist yet.
 */
export const useReviewAggregates = (
  ids: string[],
  reviewableType: string,
  fallback: Record<string, RatingAgg>,
): Record<string, RatingAgg> => {
  const [aggs, setAggs] = useState<Record<string, RatingAgg>>(fallback);

  useEffect(() => {
    if (ids.length === 0) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("reviews")
        .select("reviewable_id, rating")
        .eq("reviewable_type", reviewableType)
        .in("reviewable_id", ids);

      if (cancelled) return;
      const next: Record<string, RatingAgg> = { ...fallback };
      const buckets: Record<string, number[]> = {};
      (data ?? []).forEach((r: any) => {
        (buckets[r.reviewable_id] ??= []).push(r.rating);
      });
      Object.entries(buckets).forEach(([id, arr]) => {
        next[id] = {
          rating: arr.reduce((a, b) => a + b, 0) / arr.length,
          reviewCount: arr.length,
        };
      });
      setAggs(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|"), reviewableType]);

  return aggs;
};
