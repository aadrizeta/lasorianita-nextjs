import { NextResponse } from "next/server";
import type { InstagramApiResponse, InstagramPost } from "@/types/instagram";

const GRAPH_API = "https://graph.instagram.com";

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_ID;

  if (!accessToken || !businessId) {
    return NextResponse.json(
      { error: "Instagram credentials not configured" },
      { status: 500 },
    );
  }

  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count";
  const url = `${GRAPH_API}/${businessId}/media?fields=${fields}&limit=12&access_token=${accessToken}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    const error = await res.text();
    console.error("Instagram API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram posts" },
      { status: 502 },
    );
  }

  const json: InstagramApiResponse = await res.json();

  const posts: InstagramPost[] = json.data.filter(
    (post) =>
      post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM",
  );

  return NextResponse.json({ data: posts });
}
