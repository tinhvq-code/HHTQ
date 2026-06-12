import { readUserList } from './authSession.js';

const KEY        = 'hhtq_notifications';
const SCHED_KEY  = 'hhtq_notif_schedule';
const DELAY_MS   = 2 * 60 * 1000; // 2 phút

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatNow = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  return `${hh}:${mm}, ${dd}/${mo}`;
};

const TIME_LABELS = [
  'vài phút trước', '20 phút trước', '1 giờ trước', '2 giờ trước',
  '4 giờ trước',    '6 giờ trước',   '10 giờ trước', '12 giờ trước',
  '1 ngày trước',   '1 ngày trước',  '2 ngày trước',  '2 ngày trước',
  '3 ngày trước',   '4 ngày trước',  '5 ngày trước'
];
const timeAt = (i) => TIME_LABELS[Math.min(i, TIME_LABELS.length - 1)];

const STATIC_SYSTEM = [
  {
    id: 'sys_ui_update',
    type: 'system',
    title: 'Cập nhật tính năng mới',
    message: 'HHTQ Anime vừa cập nhật giao diện và tính năng thông báo. Khám phá ngay!',
    time: '2 giờ trước',
    anime: null
  },
  {
    id: 'sys_welcome_app',
    type: 'system',
    title: 'Chào mừng đến HHTQ Anime',
    message: 'Khám phá hàng nghìn bộ anime hấp dẫn. Chúc bạn xem phim vui vẻ!',
    time: '7 ngày trước',
    anime: null
  }
];

// ── Storage ───────────────────────────────────────────────────────────────────

export const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveNotifications = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    // Thông báo Header cập nhật badge
    window.dispatchEvent(new CustomEvent('hhtq-notif-change'));
  } catch {}
};

export const getUnreadCount = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return 0;
    return JSON.parse(raw).filter(n => !n.read).length;
  } catch { return 0; }
};

// ── Welcome notification (ngay khi login/register) ────────────────────────────

/**
 * @param {string} name   - Tên hiển thị của user
 * @param {boolean} isNew - true = đăng ký mới, false = đăng nhập lại
 */
export const addWelcomeNotification = (name, isNew) => {
  const displayName = name ? name.split(' ').pop() : 'bạn'; // lấy tên ngắn
  const existing = loadNotifications().filter(n => n.id !== 'welcome_session');
  const welcome = {
    id: 'welcome_session',
    type: 'system',
    read: false,
    title: isNew ? '🎉 Đăng ký thành công!' : '👋 Đăng nhập thành công!',
    message: isNew
      ? `Chào mừng ${displayName} đến với HHTQ Anime! Chúc bạn xem anime vui vẻ.`
      : `Chào ${displayName}! Chúc bạn xem anime vui vẻ.`,
    time: formatNow(),
    anime: null
  };
  saveNotifications([welcome, ...existing]);
};

// ── Schedule anime notifications sau 2 phút ───────────────────────────────────

/** Gọi ngay sau login/register để đặt lịch thêm thông báo phim sau 2 phút */
export const scheduleAnimeNotifications = () => {
  localStorage.setItem(SCHED_KEY, JSON.stringify({ scheduledAt: Date.now(), done: false }));
};

/**
 * Gọi khi homeData đã sẵn sàng (MenuPage / NotificationsPage).
 * Nếu còn trong vòng 2 phút: đặt setTimeout.
 * Nếu đã quá 2 phút:        thêm thông báo ngay.
 * @param {object}   homeData - dữ liệu từ fetchHomeAnime()
 * @param {Function} onUpdate - callback khi thông báo được thêm vào
 */
export const checkAndTriggerScheduled = (homeData, onUpdate) => {
  let sched;
  try {
    const raw = localStorage.getItem(SCHED_KEY);
    if (!raw) return;
    sched = JSON.parse(raw);
  } catch { return; }

  if (sched.done) return;

  const trigger = () => {
    const existing = loadNotifications();
    const next = buildFromAPI(homeData, existing, true);   // true = dùng thời gian thực
    saveNotifications(next);
    localStorage.setItem(SCHED_KEY, JSON.stringify({ ...sched, done: true }));
    onUpdate?.(next);
  };

  const remaining = (sched.scheduledAt + DELAY_MS) - Date.now();
  if (remaining <= 0) {
    trigger();
  } else {
    window.setTimeout(trigger, remaining);
  }
};

// ── Build notifications from API data ─────────────────────────────────────────

/**
 * @param {object}  homeData      - { latestAnime, comingSoon, ... }
 * @param {Array}   existingNotifs - current stored notifications (để preserve read state)
 * @param {boolean} useRealTime   - nếu true, dùng thời gian thực (formatNow) cho thông báo mới
 */
export const buildFromAPI = (homeData, existingNotifs = [], useRealTime = false) => {
  const existingMap = new Map(existingNotifs.map(n => [n.id, n]));

  const followedTitles = new Set(
    readUserList('followedAnimeItems').map(item => item.title)
  );

  const result = [];
  let timeIdx = 0;

  // ── New episodes & followed updates (latestAnime) ──
  const latestAnime = (homeData.latestAnime || []).slice(0, 12);
  latestAnime.forEach(([title, views, eps, img]) => {
    if (!title || !img) return;
    const isFollowed = followedTitles.has(title);
    const id = isFollowed ? `followed_${title}` : `ep_${title}`;

    result.push(existingMap.get(id) ?? {
      id,
      type: isFollowed ? 'followed' : 'new_episode',
      read: false,
      title: isFollowed ? 'Phim đang theo dõi cập nhật' : 'Tập mới đã cập nhật',
      message: isFollowed
        ? `${title} vừa ra ${eps} – xem ngay!`
        : `${title} vừa ra ${eps}`,
      time: useRealTime ? formatNow() : timeAt(timeIdx),
      anime: { title, img, eps, views }
    });
    timeIdx++;
  });

  // ── New anime (comingSoon) ──
  (homeData.comingSoon || []).slice(0, 5).forEach(([title, img]) => {
    if (!title || !img) return;
    const id = `new_${title}`;

    result.push(existingMap.get(id) ?? {
      id,
      type: 'new_anime',
      read: false,
      title: 'Phim mới ra mắt',
      message: `${title} vừa được thêm vào thư viện`,
      time: useRealTime ? formatNow() : timeAt(timeIdx),
      anime: { title, img, eps: 'Tập 01', views: '0 lượt xem' }
    });
    timeIdx++;
  });

  // ── Static system notifications ──
  STATIC_SYSTEM.forEach(s => {
    result.push(existingMap.get(s.id) ?? { ...s, read: false });
  });

  // Giữ lại welcome_session nếu có (đặt lên đầu)
  const welcome = existingMap.get('welcome_session');
  if (welcome) {
    result.unshift({ ...result.find(n => n.id === 'welcome_session') ?? {}, ...welcome });
    // remove duplicate nếu buildFromAPI vô tình không thêm nó
  }

  // Đảm bảo welcome_session ở đầu danh sách, không bị trùng
  const seen = new Set();
  const deduped = [];
  for (const n of result) {
    if (!seen.has(n.id)) { seen.add(n.id); deduped.push(n); }
  }

  return deduped;
};
