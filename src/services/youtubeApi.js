const YOUTUBE_API_KEY = import.meta.env?.VITE_YOUTUBE_API_KEY || '';

const formatViewCount = (value) => {
  const count = Number(value || 0);

  if (!count) return '';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M lượt xem`;
  if (count >= 1000) return `${Math.round(count / 1000)}k lượt xem`;

  return `${count} lượt xem`;
};

const pickThumbnail = (thumbnails = {}) =>
  thumbnails.maxres?.url ||
  thumbnails.high?.url ||
  thumbnails.medium?.url ||
  thumbnails.default?.url ||
  '';

export async function fetchYouTubeVideoData(videoId) {
  if (!videoId) return null;

  if (YOUTUBE_API_KEY) {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet,statistics,contentDetails');
    url.searchParams.set('id', videoId);
    url.searchParams.set('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`YouTube API ${response.status}`);
    }

    const data = await response.json();
    const video = data?.items?.[0];

    if (!video) {
      throw new Error('YouTube không có dữ liệu video');
    }

    return {
      id: videoId,
      title: video.snippet?.title || 'Trailer',
      channelTitle: video.snippet?.channelTitle || 'YouTube',
      publishedAt: video.snippet?.publishedAt || '',
      description: video.snippet?.description || '',
      thumbnail: pickThumbnail(video.snippet?.thumbnails),
      views: formatViewCount(video.statistics?.viewCount),
      duration: video.contentDetails?.duration || '',
      source: 'YouTube Data API'
    };
  }

  const oEmbedUrl = new URL('https://www.youtube.com/oembed');
  oEmbedUrl.searchParams.set('url', `https://www.youtube.com/watch?v=${videoId}`);
  oEmbedUrl.searchParams.set('format', 'json');

  const response = await fetch(oEmbedUrl.toString());

  if (!response.ok) {
    throw new Error(`YouTube oEmbed ${response.status}`);
  }

  const data = await response.json();

  return {
    id: videoId,
    title: data?.title || 'Trailer',
    channelTitle: data?.author_name || 'YouTube',
    publishedAt: '',
    description: '',
    thumbnail: data?.thumbnail_url || '',
    views: '',
    duration: '',
    source: 'YouTube oEmbed'
  };
}
