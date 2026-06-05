const API_BASE = 'https://graphql.anilist.co';

const fetchGraphQL = async (query, variables = {}) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    return response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const pickImage = (anime) => anime?.coverImage?.large || anime?.coverImage?.medium || '';

const titleOf = (anime) =>
  anime?.title?.english ||
  anime?.title?.romaji ||
  anime?.title?.native ||
  'Donghua mới';

const formatViews = (anime) => {
  const popularity = Number(anime?.popularity || 0);

  if (popularity >= 1000000) return `${(popularity / 1000000).toFixed(1)}M lượt xem`;
  if (popularity >= 1000) return `${Math.round(popularity / 1000)}k lượt xem`;

  return `${popularity} lượt xem`;
};

const formatEpisode = (anime, index = 0) => {
  if (anime?.episodes) return `Tập ${anime.episodes}`;
  if (anime?.status === 'NOT_YET_RELEASED') return 'Sắp chiếu';

  return `Tập ${String(index + 1).padStart(2, '0')}`;
};

const toLatest = (anime, index) => [
  titleOf(anime),
  formatViews(anime),
  formatEpisode(anime, index),
  pickImage(anime)
];

const toVideoRow = (anime, index) => [
  titleOf(anime),
  formatEpisode(anime, index),
  formatViews(anime),
  pickImage(anime)
];

const toComingSoon = (anime) => [titleOf(anime), pickImage(anime)];

const toRanking = (anime) => [
  titleOf(anime),
  anime?.episodes ? `${anime.episodes} tập` : 'Đang cập nhật',
  formatViews(anime),
  pickImage(anime)
];

const toNews = (anime, index) => [
  `${titleOf(anime)} vừa cập nhật thông tin mới`,
  `Tin Anime / ${index + 1} giờ trước`,
  formatViews(anime),
  pickImage(anime)
];

const toManga = (anime) => [titleOf(anime), pickImage(anime)];

const validRows = (rows) => rows.filter((item) => item.every(Boolean));

const requireApiRows = (nextRows, limit) => {
  const rows = validRows(nextRows).slice(0, limit);

  if (!rows.length) {
    throw new Error('API không có dữ liệu hợp lệ');
  }

  return rows;
};

const animeQuery = `
query ($perPage: Int) {
  Page(page: 1, perPage: $perPage) {
    media(
      type: ANIME
      countryOfOrigin: CN
      sort: POPULARITY_DESC
    ) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      popularity
      episodes
      status
    }
  }
}
`;

const getAnimeList = async (limit) => {
  const result = await fetchGraphQL(animeQuery, { perPage: limit });
  return result?.data?.Page?.media || [];
};

export async function fetchHomeAnime() {
  const animeList = await getAnimeList(30);

  return {
    comingSoon: requireApiRows(animeList.slice(0, 20).map(toComingSoon), 20),
    latestAnime: requireApiRows(animeList.slice(0, 24).map(toLatest), 24),
    ranking: requireApiRows(animeList.slice(0, 12).map(toRanking), 12),
    news: requireApiRows(animeList.slice(0, 10).map(toNews), 10),
    manga: requireApiRows(animeList.slice(0, 18).map(toManga), 18)
  };
}

export async function fetchAnimeCatalog(limit = 30) {
  const animeList = await getAnimeList(limit);
  return requireApiRows(animeList.map(toVideoRow), limit);
}
