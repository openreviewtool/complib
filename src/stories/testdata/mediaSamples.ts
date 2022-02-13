import { MediaInfo } from '../../component/core/MediaPlayer/types';


const vimeo1: MediaInfo = {
  provider_name: 'Vimeo',
  type: 'video',
  url: 'https://vimeo.com/channels/staffpicks/539430817',

  width: 640,
  height: 360,

  thumbnail_url: 'https://i.vimeocdn.com/video/1116774666_640.jpg',
  title: 'The Pitch Song',
  author_url: 'https://vimeo.com/giantant',

  duration: 94.59,
};


const vimeo2: MediaInfo = {
  provider_name: 'Vimeo',
  type: 'video',
  url: 'https://vimeo.com/218698089',

  width: 640,
  height: 360,

  thumbnail_url: 'https://i.vimeocdn.com/video/440117690-5df6116518b0520b43cb9d9cdc2acf8e93e7d3ddf12f728c34ccd241400f168f-d_295x166',
  title: "Personification by The Bazillions",

  author_name: 'eg design',
  author_url: 'https://vimeo.com/eeegee',

  duration: 146.24,
};

const youtube1: MediaInfo = {
  provider_name: 'YouTube',
  type: 'video',
  url: 'https://www.youtube.com/watch?v=KMX_FuOLoCI',

  width: 200,
  height: 150,
  duration: 56.121,

  thumbnail_url: 'https://i.ytimg.com/vi/KMX_FuOLoCI/hqdefault.jpg',
  title: 'Steve Jobs Makes Fun of DOS in 1992',

  author_name: 'MusRest',
  author_url: 'https://www.youtube.com/c/AriWeinstein',
};

const youtube2: MediaInfo = {
  provider_name: 'YouTube',
  type: 'video',
  url: 'https://www.youtube.com/watch?v=o-YBDTqX_ZU',

  width: 200,
  height: 150,
  duration: 212.041,

  thumbnail_url: 'https://i.ytimg.com/vi/o-YBDTqX_ZU/hqdefault.jpg',
  title: 'Rick Astley - Never Gonna Give You Up',

  author_url: 'https://www.youtube.com/c/MusRest',
};

const video1: MediaInfo = {
  provider_name: '',
  type: 'video',
  url: 'https://ia601604.us.archive.org/13/items/PopeyeTheSailorMeetsAliBabasFortyThieves1937/PopeyeTheSailorMeetsAliBabasFortyThieves.mp4',
  title: 'PopeyeTheSailorMeetsAliBabasFortyThieves.mp4',

  width: 640,
  height: 480,
  duration: 1011.36,
};

const video2: MediaInfo = {
  provider_name: '',
  type: 'video',

  url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4',
  title: 'Big_Buck_Bunny_720_10s_2MB.mp4',

  width: 1280,
  height: 720,
  duration: 10,
};

const video3: MediaInfo = {
  provider_name: '',
  type: 'video',

  url: 'https://cdn.videvo.net/videvo_files/video/free/2019-02/small_watermarked/181004_10_LABORATORIES-SCIENCE_12_preview.webm',
  title: '181004_10_LABORATORIES-SCIENCE_12_preview.webm',

  width: 428,
  height: 240,
  duration: 8.563,
};

const image1: MediaInfo = {
  provider_name: '',
  type: 'image',
  url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Claude_Monet_-_Nymph%C3%A9as%2C_effet_du_soir_W1504_-_Mus%C3%A9e_Marmottan-Monet.jpg',

  width: 1404,
  height: 1024,
  duration: 0,
};

const soundCloud1: MediaInfo = {
  provider_name: 'SoundCloud',
  type: 'audio',
  url: 'https://soundcloud.com/miami-nights-1984/accelerated',

  width: 800,
  height: 450,
  duration: 236.43,

  title: 'MIAMI NIGHTS 1984',
};

export const mediaSamples: MediaInfo[] = [
  vimeo1,
  youtube1,
  video2,
  video3,
  soundCloud1,
];

export const mediaSamples2: MediaInfo[] = [
  video2,
  vimeo1,
  youtube2,
  image1,
  soundCloud1,
];

export const svgShapeUrls = [
  'https://upload.wikimedia.org/wikipedia/commons/7/71/Arrow_east.svg',
];

export const artUrls = [
  'https://upload.wikimedia.org/wikipedia/commons/9/9c/Claude_Monet_-_Nymph%C3%A9as%2C_effet_du_soir_W1504_-_Mus%C3%A9e_Marmottan-Monet.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1024px-Tsunami_by_hokusai_19th_century.jpg',
];

// More friendly data format for storybook knobs to have labels.
export const mediaSamplesWithLabel = mediaSamples.reduce((a: any[], c) => {
  a.push({ ...c, label: c.title });
  return a;
}, []);