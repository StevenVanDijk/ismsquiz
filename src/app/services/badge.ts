import { Injectable } from '@angular/core';
import { Badge } from '../models/badge.model';
import { UserProgress } from '../models/progress.model';

export interface AnswerEvent {
  chapterId: string;
  correct: boolean;
  totalQuestionsInChapter: number;
  isFirstQuiz: boolean;
  sessionCorrect: number;
  sessionTotal: number;
}

@Injectable({ providedIn: 'root' })
export class BadgeService {
  evaluateAll(progress: UserProgress, event: AnswerEvent, allBadges: Badge[]): string[] {
    const newIds: string[] = [];

    for (const badge of allBadges) {
      if (progress.unlockedBadgeIds.includes(badge.id)) continue;

      const { trigger, chapterId, threshold } = badge.criteria;

      let unlocked = false;
      switch (trigger) {
        case 'first_quiz':
          unlocked = event.isFirstQuiz && event.sessionTotal === 1;
          break;
        case 'chapter_complete':
          if (chapterId && progress.chapterProgress[chapterId]) {
            unlocked = progress.chapterProgress[chapterId].completed;
          }
          break;
        case 'all_chapters_complete':
          unlocked = Object.values(progress.chapterProgress).length > 0 &&
            Object.values(progress.chapterProgress).every(cp => cp.completed);
          break;
        case 'perfect_score':
          unlocked = event.sessionTotal > 0 &&
            event.sessionCorrect === event.sessionTotal &&
            event.sessionTotal === event.totalQuestionsInChapter;
          break;
        case 'streak':
          unlocked = threshold !== undefined && progress.currentStreak >= threshold;
          break;
        case 'total_xp':
          unlocked = threshold !== undefined && progress.totalXP >= threshold;
          break;
        case 'questions_answered':
          unlocked = threshold !== undefined && progress.totalQuestionsAnswered >= threshold;
          break;
      }

      if (unlocked) newIds.push(badge.id);
    }

    return newIds;
  }
}
