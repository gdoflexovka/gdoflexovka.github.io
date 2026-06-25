export type Track = {
  id: string;
  title: string;
  author: string;
  audioSrc?: string;
  newgroundsUrl?: string;
};

export type Level = {
  id: string;
  trackId: string | null;
};

export type Chapter = {
  id: string;
  title: string;
  levelIds: string[];
};

export const TRACKS: Track[] = [  { id: "tmqtj5ff1", title: "Clubstep", author: "RobTop", audioSrc: "/tracks/clubstep.mp3" },
  { id: "tmqtj9g6n", title: "Deadlock", author: "RopTop", audioSrc: "/tracks/deadlock.mp3" },
  { id: "tmqtj9xg3", title: "Theory Of Everything 2", author: "RopTop", audioSrc: "/tracks/theoryofeverything2.mp3" },
  { id: "tmqtjah2v", title: "Nine Circles", author: "Zobros", audioSrc: "/tracks/ninecircles.mp3" },
  { id: "tmqtjcc7v", title: "Supersonic", author: "ZenthicAlpha", audioSrc: "/tracks/supersonic.mp3" },
  { id: "tmqtjejrf", title: "B", author: "Motleyorc", audioSrc: "/tracks/b.mp3" },
  { id: "tmqtjfziz", title: "8o", author: "Zobros", audioSrc: "/tracks/8o.mp3" },
  { id: "tmqtjhs7e", title: "Yatagarasu", author: "TrusTa", audioSrc: "/tracks/yatagarasu.mp3" },
  { id: "tmqtjjef2", title: "Erebus", author: "BoldStep", audioSrc: "/tracks/erebus.mp3" },
  { id: "tmqtjkzfh", title: "Sonic Wave", author: "lSunix", audioSrc: "/tracks/sonicwave.mp3" },
  { id: "tmqtjms9f", title: "Cataclysm", author: "Ggb0y", audioSrc: "/tracks/cataclysm.mp3" },
  { id: "tmqtjvsh1", title: "Bloodbath", author: "Riot", audioSrc: "/tracks/bloodbath.mp3" },
  { id: "tmqtjziy4", title: "Acropolis", author: "Zobros", audioSrc: "/tracks/acropolis.mp3" },
  { id: "tmqtkayts", title: "Firework", author: "Trick", audioSrc: "/tracks/firework.mp3" },
  { id: "tmqtkcp6u", title: "Limbo", author: "MindCap", audioSrc: "/tracks/limbo.mp3" },
  { id: "tmqtkezg0", title: "Aftermath", author: "IIExenityII", audioSrc: "/tracks/aftermath.mp3" },
  { id: "tmqtkgijs", title: "Sakupen Hell", author: "TrusTa", audioSrc: "/tracks/sakupenhell.mp3" },
  { id: "tmqtkitjd", title: "Zodiac", author: "BIANOX", audioSrc: "/tracks/zodiac.mp3" },
  { id: "tmqtkkrzq", title: "Death Corridor", author: "lSunix", audioSrc: "/tracks/deathcorridor.mp3" },
  { id: "tmqtkoyua", title: "Slaughterhouse", author: "IcEDCave", audioSrc: "/tracks/slaughterhouse.mp3" },
  { id: "tmqtkt7p8", title: "Acheron", author: "ryamu", audioSrc: "/tracks/acheron.mp3" },
  { id: "tmqtkuqr3", title: "Avernus", author: "PockeWindfish", audioSrc: "/tracks/avernus.mp3" },
  { id: "tmqtkwsyj", title: "Grief", author: "HosenGD", audioSrc: "/tracks/grief.mp3" },
  { id: "tmqtky2qk", title: "Tidal Wave", author: "OniLinkGD", audioSrc: "/tracks/tidalwave.mp3" },
];

export const LEVELS: Level[] = [  { id: "lmqthp28i", trackId: "tmqtjah2v" },
  { id: "lmqtkym4c", trackId: "tmqtjejrf" },
  { id: "lmqtkyna6", trackId: "tmqtj5ff1" },  { id: "lmqtkyo6y", trackId: "tmqtj9xg3" },
  { id: "lmqtkyrnf", trackId: "tmqtj9g6n" },
  { id: "lmqtkzp1n", trackId: "tmqtjfziz" },  { id: "lmqtl0uvn", trackId: "tmqtjziy4" },
  { id: "lmqtl0v8o", trackId: "tmqtjjef2" },
  { id: "lmqtl0vm3", trackId: "tmqtjms9f" },
  { id: "lmqtl0w0g", trackId: "tmqtjvsh1" },
  { id: "lmqtl0wcr", trackId: "tmqtjhs7e" },
  { id: "lmqtl0wqb", trackId: "tmqtjkzfh" },
  { id: "lmqtl16ia", trackId: "tmqtjcc7v" },
  { id: "lmqtl6b6q", trackId: "tmqtkitjd" },
  { id: "lmqtl6chv", trackId: "tmqtkgijs" },
  { id: "lmqtl6d1f", trackId: "tmqtkezg0" },
  { id: "lmqtl6dji", trackId: "tmqtkcp6u" },
  { id: "lmqtl6fv0", trackId: "tmqtkayts" },
  { id: "lmqtl836c", trackId: "tmqtkuqr3" },  { id: "lmqtl83qu", trackId: "tmqtkoyua" },
  { id: "lmqtl8409", trackId: "tmqtkkrzq" },
  { id: "lmqtl84aq", trackId: "tmqtky2qk" },
  { id: "lmqtl8rhb", trackId: "tmqtkt7p8" },
  { id: "lmqtl98mu", trackId: "tmqtkwsyj" },
];

export const CHAPTERS: Chapter[] = [  {
    id: "chmqthovza",
    title: "Сиксевенские войска",
    levelIds: [ "lmqtkzp1n", "lmqtkyrnf", "lmqtkyo6y", "lmqtkyna6", "lmqtkym4c", "lmqthp28i",],
  },
  {
    id: "chmqtl0nnv",
    title: "Севенские войска",
    levelIds: [ "lmqtl16ia", "lmqtl0wqb", "lmqtl0wcr", "lmqtl0w0g", "lmqtl0vm3", "lmqtl0v8o", "lmqtl0uvn",],
  },
  {
    id: "chmqtl4bre",
    title: "Что под руку попало",
    levelIds: [ "lmqtl6fv0", "lmqtl6dji", "lmqtl6d1f", "lmqtl6chv","lmqtl6b6q"],
  },
  {
    id: "chmqtl7ymd",
    title: "Мега хуйня",
    levelIds: [ "lmqtl98mu", "lmqtl8rhb", "lmqtl84aq", "lmqtl8409", "lmqtl83qu", "lmqtl836c"],
  },
];

export const STAGES: { duration: number; points: number; label: string }[] = [
  { duration: 0.5, points: 6, label: "Бурмалда" },
  { duration: 1.0, points: 4, label: "Нармалда" },
  { duration: 2.0, points: 3, label: "Вонд павiк" },
  { duration: 5.0, points: 2, label: "Чизи" },
  { duration: 15.0, points: 1, label: "Гербиз" },
];

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1243";
const AUTH_KEY = "gd_music_challenge_admin_auth";

export function adminLogin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    if (typeof window !== "undefined") localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function getTrackById(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function getLevelById(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function normalizeAnswer(s: string): string {
  return s.toLowerCase().replace(/[\s\-_.]+/g, "").trim();
}
