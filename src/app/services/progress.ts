import { Injectable, signal, computed, inject } from '@angular/core';
import { UserProgress, ChapterProgress } from '../models/progress.model';
import { Badge } from '../models/badge.model';
import { BadgeService, AnswerEvent } from './badge';

const STORAGE_KEY = 'nen7510_progress_v1';
const SCHEMA_VERSION = 1;

function defaultProgress(): UserProgress {
  return {
    version: SCHEMA_VERSION,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalQuestionsAnswered: 0,
    totalQuestionsCorrect: 0,
    unlockedBadgeIds: [],
    newlyUnlockedBadgeIds: [],
    chapterProgress: {},
    lastActiveAt: new Date().toISOString(),
  };
}

function defaultChapterProgress(chapterId: string, totalQuestions: number): ChapterProgress {
  return {
    chapterId,
    questionsAnswered: 0,
    questionsCorrect: 0,
    totalQuestions,
    completed: false,
    lastAttemptAt: new Date().toISOString(),
    questionResults: {},
  };
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private badgeService = inject(BadgeService);

  private _progress = signal<UserProgress>(this.loadOrInit());

  readonly progress = this._progress.asReadonly();

  readonly totalXP = computed(() => this._progress().totalXP);
  readonly currentStreak = computed(() => this._progress().currentStreak);
  readonly unlockedBadgeIds = computed(() => this._progress().unlockedBadgeIds);
  readonly newlyUnlockedBadgeIds = computed(() => this._progress().newlyUnlockedBadgeIds);
  readonly totalQuestionsAnswered = computed(() => this._progress().totalQuestionsAnswered);

  getChapterProgress(chapterId: string): ChapterProgress | undefined {
    return this._progress().chapterProgress[chapterId];
  }

  getChapterPercentage(chapterId: string): number {
    const cp = this._progress().chapterProgress[chapterId];
    if (!cp || cp.totalQuestions === 0) return 0;
    return Math.round((cp.questionsCorrect / cp.totalQuestions) * 100);
  }

  getOverallPercentage(chapterIds: string[]): number {
    if (chapterIds.length === 0) return 0;
    const completed = chapterIds.filter(id => this._progress().chapterProgress[id]?.completed).length;
    return Math.round((completed / chapterIds.length) * 100);
  }

  recordAnswer(
    questionId: string,
    chapterId: string,
    correct: boolean,
    xpValue: number,
    totalQuestionsInChapter: number,
    allBadges: Badge[],
    sessionCorrect: number,
    sessionTotal: number
  ): string[] {
    const prev = this._progress();
    const isFirstQuestion = prev.totalQuestionsAnswered === 0;

    let cp: ChapterProgress = prev.chapterProgress[chapterId]
      ? { ...prev.chapterProgress[chapterId], questionResults: { ...prev.chapterProgress[chapterId].questionResults } }
      : defaultChapterProgress(chapterId, totalQuestionsInChapter);

    const existing = cp.questionResults[questionId];
    const alreadyAnsweredCorrectly = existing?.answeredCorrectly ?? false;

    cp.questionResults[questionId] = {
      questionId,
      answeredCorrectly: correct,
      answeredAt: new Date().toISOString(),
      attemptCount: (existing?.attemptCount ?? 0) + 1,
    };

    cp.questionsAnswered = Object.keys(cp.questionResults).length;
    cp.questionsCorrect = Object.values(cp.questionResults).filter(r => r.answeredCorrectly).length;
    cp.totalQuestions = totalQuestionsInChapter;
    cp.completed = cp.questionsCorrect >= cp.totalQuestions;
    cp.lastAttemptAt = new Date().toISOString();

    const newStreak = correct ? prev.currentStreak + 1 : 0;
    const newXP = prev.totalXP + (correct && !alreadyAnsweredCorrectly ? xpValue : 0);

    const updated: UserProgress = {
      ...prev,
      totalXP: newXP,
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      totalQuestionsCorrect: prev.totalQuestionsCorrect + (correct ? 1 : 0),
      chapterProgress: { ...prev.chapterProgress, [chapterId]: cp },
      lastActiveAt: new Date().toISOString(),
    };

    const event: AnswerEvent = {
      chapterId,
      correct,
      totalQuestionsInChapter,
      isFirstQuiz: isFirstQuestion,
      sessionCorrect,
      sessionTotal,
    };

    const newBadgeIds = this.badgeService.evaluateAll(updated, event, allBadges);
    updated.unlockedBadgeIds = [...updated.unlockedBadgeIds, ...newBadgeIds];
    updated.newlyUnlockedBadgeIds = [...updated.newlyUnlockedBadgeIds, ...newBadgeIds];

    this._progress.set(updated);
    this.save(updated);
    return newBadgeIds;
  }

  clearNewlyUnlocked(): void {
    const updated = { ...this._progress(), newlyUnlockedBadgeIds: [] };
    this._progress.set(updated);
    this.save(updated);
  }

  resetProgress(): void {
    const fresh = defaultProgress();
    this._progress.set(fresh);
    this.save(fresh);
  }

  private save(p: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      // Storage full or unavailable — continue silently
    }
  }

  private loadOrInit(): UserProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserProgress;
        if (parsed.version === SCHEMA_VERSION) return parsed;
      }
    } catch {
      // Corrupted data — start fresh
    }
    return defaultProgress();
  }
}
