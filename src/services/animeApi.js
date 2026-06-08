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
const pickTrailer = (anime) => {
  if (!anime?.trailer?.id || anime.trailer.site !== 'youtube') return null;

  return {
    id: anime.trailer.id,
    site: anime.trailer.site,
    thumbnail: anime.trailer.thumbnail || ''
  };
};

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

const genresOf = (anime) => anime?.genres || [];

const toLatest = (anime, index) => [
  titleOf(anime),
  formatViews(anime),
  formatEpisode(anime, index),
  pickImage(anime),
  pickTrailer(anime),
  genresOf(anime)
];

const toVideoRow = (anime, index) => [
  titleOf(anime),
  formatEpisode(anime, index),
  formatViews(anime),
  pickImage(anime),
  pickTrailer(anime),
  genresOf(anime)
];

const toComingSoon = (anime) => [titleOf(anime), pickImage(anime)];

const toRanking = (anime) => [
  titleOf(anime),
  anime?.episodes ? `${anime.episodes} tập` : 'Đang cập nhật',
  formatViews(anime),
  pickImage(anime),
  pickTrailer(anime),
  genresOf(anime)
];

const toNews = (anime, index) => [
  `${titleOf(anime)} vừa cập nhật thông tin mới`,
  `Tin Anime / ${index + 1} giờ trước`,
  formatViews(anime),
  pickImage(anime)
];

const toManga = (manga) => [titleOf(manga), pickImage(manga)];

const toMangaRanking = (manga, index) => [
  titleOf(manga),
  manga?.chapters ? `Chap ${manga.chapters}` : `Chap ${String(index + 1).padStart(2, '0')}`,
  formatViews(manga),
  pickImage(manga)
];

const validRows = (rows) => rows.filter((item) => item.slice(0, 4).every(Boolean));

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
      genres
      trailer {
        id
        site
        thumbnail
      }
    }
  }
}
`;

const mangaQuery = `
query ($perPage: Int) {
  Page(page: 1, perPage: $perPage) {
    media(
      type: MANGA
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
      chapters
      status
    }
  }
}
`;

const fallbackAnimeRows = [
  ['Tuy\u1ebft \u01afng L\u0129nh Ch\u1ee7', 'T\u1eadp 1', '432k l\u01b0\u1ee3t xem', '/assets/anime-01.jpg', null, ['Action', 'Fantasy']],
  ['V\u1ea1n C\u1ed5 Ki\u1ebfm T\u00f4n', 'T\u1eadp 18', '756k l\u01b0\u1ee3t xem', '/assets/anime-06.jpg', null, ['Adventure']],
  ['Thi\u00ean \u0110\u1ea1o Huy\u1ec1n S\u01b0', 'T\u1eadp 12', '612k l\u01b0\u1ee3t xem', '/assets/anime-07.jpg', null, ['Fantasy']],
  ['Long T\u1ed9c Tr\u1ed7i D\u1eady', 'T\u1eadp m\u1edbi', '723k l\u01b0\u1ee3t xem', '/assets/anime-08.jpg', null, ['Action']],
  ['Ma V\u1ef1c Phong Th\u1ea7n', 'T\u1eadp 09', '488k l\u01b0\u1ee3t xem', '/assets/anime-09.jpg', null, ['Supernatural']],
  ['H\u1ecfa Ph\u1ee5ng Li\u00ean Th\u00e0nh', 'T\u1eadp 22', '417k l\u01b0\u1ee3t xem', '/assets/anime-10.jpg', null, ['Drama']],
  ['Tinh H\u00e0 Chi\u1ebfn K\u1ef7', 'T\u1eadp 15', '365k l\u01b0\u1ee3t xem', '/assets/anime-11.jpg', null, ['Sci-Fi']],
  ['Th\u01b0\u01a1ng Khung B\u00ed S\u1eed', 'T\u1eadp 06', '289k l\u01b0\u1ee3t xem', '/assets/anime-12.jpg', null, ['Mystery']],
  ['Ng\u1ef1 Ki\u1ebfm S\u01a1n H\u00e0', 'T\u1eadp 30', '842k l\u01b0\u1ee3t xem', '/assets/anime-13.jpg', null, ['Action']]
];

const fallbackMangaRows = [
  ['\u0110\u1ea1i Ch\u00faa T\u1ec3', '/assets/anime-02.jpg'],
  ['Linh Ki\u1ebfm T\u00f4n', '/assets/anime-03.jpg'],
  ['V\u00f5 Luy\u1ec7n \u0110\u1ec9nh Phong', '/assets/anime-04.jpg'],
  ['Ti\u00ean Ngh\u1ecbch', '/assets/anime-05.jpg'],
  ['Th\u1ea7n \u1ea4n V\u01b0\u01a1ng T\u1ecda', '/assets/anime-06.jpg']
];

const fallbackHomeAnime = () => ({
  comingSoon: fallbackAnimeRows.map((item) => [item[0], item[3]]),
  latestAnime: fallbackAnimeRows,
  ranking: fallbackAnimeRows,
  news: fallbackAnimeRows.slice(0, 6).map((item, index) => [
    `${item[0]} v\u1eeba c\u1eadp nh\u1eadt th\u00f4ng tin m\u1edbi`,
    `Tin Anime / ${index + 1} gi\u1edd tr\u01b0\u1edbc`,
    item[2],
    item[3]
  ]),
  manga: fallbackMangaRows,
  mangaRanking: fallbackMangaRows.map((item, index) => [
    item[0],
    `Chap ${String(index + 1).padStart(2, '0')}`,
    `${(index + 2) * 128}k l\u01b0\u1ee3t \u0111\u1ecdc`,
    item[1]
  ])
});

const getAnimeList = async (limit) => {
  const result = await fetchGraphQL(animeQuery, { perPage: limit });
  return result?.data?.Page?.media || [];
};

const getMangaList = async (limit) => {
  const result = await fetchGraphQL(mangaQuery, { perPage: limit });
  return result?.data?.Page?.media || [];
};

export async function fetchHomeAnime() {
  try {
    const [animeList, mangaList] = await Promise.all([
      getAnimeList(30),
      getMangaList(24)
    ]);

    return {
      comingSoon: requireApiRows(animeList.slice(0, 20).map(toComingSoon), 20),
      latestAnime: requireApiRows(animeList.slice(0, 24).map(toLatest), 24),
      ranking: requireApiRows(animeList.slice(0, 12).map(toRanking), 12),
      news: requireApiRows(animeList.slice(0, 10).map(toNews), 10),
      manga: requireApiRows(mangaList.slice(0, 18).map(toManga), 18),
      mangaRanking: requireApiRows(mangaList.slice(0, 12).map(toMangaRanking), 12)
    };
  } catch {
    return fallbackHomeAnime();
  }
}

export async function fetchAnimeCatalog(limit = 30) {
  try {
    const animeList = await getAnimeList(limit);
    return requireApiRows(animeList.map(toVideoRow), limit);
  } catch {
    return fallbackAnimeRows.slice(0, limit);
  }
}
