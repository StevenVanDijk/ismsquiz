export type BadgeTrigger =
  | 'chapter_complete'
  | 'perfect_score'
  | 'streak'
  | 'total_xp'
  | 'questions_answered'
  | 'all_chapters_complete'
  | 'first_quiz';

export interface BadgeCriteria {
  trigger: BadgeTrigger;
  chapterId?: string;
  threshold?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: BadgeCriteria;
  sortOrder: number;
}

export interface BadgeCollection {
  badges: Badge[];
}
