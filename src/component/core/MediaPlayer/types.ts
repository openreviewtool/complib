export interface MediaInfo {
  provider_name: string;
  type: 'video' | 'image' | 'audio';
  url: string;

  width: number;
  height: number;
  duration: number;

  thumbnail_url?: string;
  title?: string;

  author_name?: string;
  author_url?: string;
}

export interface PlayerState {
  // these are in seconds
  played: number;
  loaded: number;
  duration: number;
}
