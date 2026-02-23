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

export interface InstagramProfile {
  username: string;
  name: string;
  profile_picture_url: string;
}

export interface InstagramApiResponse {
  data: InstagramPost[];
  profile: InstagramProfile;
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
  };
}
