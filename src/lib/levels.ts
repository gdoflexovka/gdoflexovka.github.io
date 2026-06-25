// База данных уровней. Чтобы добавить трек — положи mp3 в public/tracks/
// и пропиши путь в audioSrc, например "/tracks/level-1.mp3".

export type Level = {
  id: string;
  title: string;
  author: string;
  audioSrc?: string; // undefined = заглушка, трек ещё не загружен
};

export type Chapter = {
  id: string;
  title: string;
  subtitle?: string;
  levelIds: string[];
};

export const LEVELS: Level[] = [
  { id: "l1", title: "Уровень 1", author: "—" },
  { id: "l2", title: "Уровень 2", author: "—" },
  { id: "l3", title: "Уровень 3", author: "—" },
  { id: "l4", title: "Уровень 4", author: "—" },
  { id: "l5", title: "Уровень 5", author: "—" },
  { id: "l6", title: "Уровень 6", author: "—" },
];

export const CHAPTERS: Chapter[] = [
  {
    id: "leha-i-six-seven",
    title: "Лёха и сикс севен",
    subtitle: "Глава 1 · 6 уровней подряд в случайном порядке",
    levelIds: ["l1", "l2", "l3", "l4", "l5", "l6"],
  },
];

export const STAGES: { duration: number; points: number; label: string }[] = [
  { duration: 0.5, points: 5, label: "Бурмалда" },
  { duration: 1.0, points: 4, label: "Нармалда" },
  { duration: 2.0, points: 3, label: "Вонд павiк" },
  { duration: 5.0, points: 2, label: "Чизи" },
  { duration: 15.0, points: 1, label: "Гербиз" },
];

export function getLevelById(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

// Нормализация ответа: убираем регистр, пробелы, дефисы — для сверки.
export function normalizeAnswer(s: string): string {
  return s.toLowerCase().replace(/[\s\-_.]+/g, "").trim();
}
