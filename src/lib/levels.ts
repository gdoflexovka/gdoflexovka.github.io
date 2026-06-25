export type Track = {
  id: string;
  title: string;
  author: string;
  audioSrc?: string;
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

export const TRACKS: Track[] = [
  { id: "t1", title: "Трек 1", author: "—" },
  { id: "t2", title: "Трек 2", author: "—" },
  { id: "t3", title: "Трек 3", author: "—" },
  { id: "t4", title: "Трек 4", author: "—" },
  { id: "t5", title: "Трек 5", author: "—" },
  { id: "t6", title: "Трек 6", author: "—" },];

export const LEVELS: Level[] = [
  { id: "l1", trackId: "t1" },
  { id: "l2", trackId: "t2" },
  { id: "l3", trackId: "t3" },
  { id: "l4", trackId: "t4" },
  { id: "l5", trackId: "t5" },
  { id: "l6", trackId: "t6" },
];

export const CHAPTERS: Chapter[] = [
  {
    id: "main",
    title: "Основной челлендж",
    levelIds: ["l1", "l2", "l3", "l4", "l5", "l6"],
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
