export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count: number;
}

export interface InstagramApiResponse {
  data: InstagramPost[];
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
  };
}
