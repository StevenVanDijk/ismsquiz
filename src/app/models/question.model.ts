export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  chapterId: string;
  sectionRef: string;
  difficulty: DifficultyLevel;
  question: string;
  options: AnswerOption[];
  correctAnswerId: string;
  explanation: string;
  hint?: string;
  tags?: string[];
  xpValue: number;
}

export interface ChapterQuestions {
  chapterId: string;
  title: string;
  questions: Question[];
}
