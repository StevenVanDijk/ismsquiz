export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  totalQuestions: number;
  xpReward: number;
}

export interface ChapterIndex {
  chapters: Chapter[];
  version: string;
  lastUpdated: string;
}
