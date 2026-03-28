export interface QuestionResult {
  questionId: string;
  answeredCorrectly: boolean;
  answeredAt: string;
  attemptCount: number;
}

export interface ChapterProgress {
  chapterId: string;
  questionsAnswered: number;
  questionsCorrect: number;
  totalQuestions: number;
  completed: boolean;
  lastAttemptAt: string;
  questionResults: Record<string, QuestionResult>;
}

export interface UserProgress {
  version: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  unlockedBadgeIds: string[];
  newlyUnlockedBadgeIds: string[];
  chapterProgress: Record<string, ChapterProgress>;
  lastActiveAt: string;
}
