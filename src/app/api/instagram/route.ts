import { NextResponse } from "next/server";
import type { InstagramApiResponse } from "@/types/instagram";

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

  const mediaFields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count";
  const mediaUrl = `${GRAPH_API}/${businessId}/media?fields=${mediaFields}&limit=24&access_token=${accessToken}`;
  const profileUrl = `${GRAPH_API}/${businessId}?fields=username,name,profile_picture_url&access_token=${accessToken}`;

  const [mediaRes, profileRes] = await Promise.all([
    fetch(mediaUrl, { next: { revalidate: 3600 } }),
    fetch(profileUrl, { next: { revalidate: 3600 } }),
  ]);

  if (!mediaRes.ok || !profileRes.ok) {
    const error = await (!mediaRes.ok ? mediaRes : profileRes).text();
    console.error("Instagram API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram data" },
      { status: 502 },
    );
  }

  const [media, profile]: [
    InstagramApiResponse,
    { username: string; name: string; profile_picture_url: string },
  ] = await Promise.all([mediaRes.json(), profileRes.json()]);

  return NextResponse.json({ data: media.data, profile });
}
