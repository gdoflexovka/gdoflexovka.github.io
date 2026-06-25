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

export const TRACKS: Track[] = [];

export const LEVELS: Level[] = [];

export const CHAPTERS: Chapter[] = [];

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
