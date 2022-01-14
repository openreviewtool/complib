export interface MediaInfo {
  provider_name: string;
  url: string;

  width: number;
  height: number;
  duration: number;

  thumbnail_url?: string;
  title?: string;

  author_url?: string;
}
