import { TestBed } from '@angular/core/testing';
import { BadgeService, AnswerEvent } from './badge';
import { Badge } from '../models/badge.model';
import { UserProgress } from '../models/progress.model';

function baseProgress(overrides: Partial<UserProgress> = {}): UserProgress {
  return {
    version: 1,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalQuestionsAnswered: 0,
    totalQuestionsCorrect: 0,
    unlockedBadgeIds: [],
    newlyUnlockedBadgeIds: [],
    chapterProgress: {},
    lastActiveAt: new Date().toISOString(),
    ...overrides,
  };
}

function baseEvent(overrides: Partial<AnswerEvent> = {}): AnswerEvent {
  return {
    chapterId: 'ch04',
    correct: true,
    totalQuestionsInChapter: 5,
    isFirstQuiz: false,
    sessionCorrect: 1,
    sessionTotal: 1,
    ...overrides,
  };
}

function badge(id: string, trigger: string, extras: Partial<Badge> = {}): Badge {
  return {
    id,
    name: id,
    description: id,
    icon: 'star',
    color: '#fff',
    sortOrder: 0,
    criteria: { trigger: trigger as any, ...(extras.criteria ?? {}) },
    ...extras,
  } as Badge;
}

describe('BadgeService', () => {
  let service: BadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BadgeService] });
    service = TestBed.inject(BadgeService);
  });

  // US-034 – first_quiz trigger
  it('US-034: unlocks first_quiz badge on very first answer', () => {
    const badges = [badge('first-quiz', 'first_quiz')];
    const result = service.evaluateAll(
      baseProgress({ totalQuestionsAnswered: 1 }),
      baseEvent({ isFirstQuiz: true, sessionTotal: 1 }),
      badges
    );
    expect(result).toContain('first-quiz');
  });

  it('US-034: does not unlock first_quiz when sessionTotal > 1', () => {
    const badges = [badge('first-quiz', 'first_quiz')];
    const result = service.evaluateAll(
      baseProgress({ totalQuestionsAnswered: 2 }),
      baseEvent({ isFirstQuiz: true, sessionTotal: 2 }),
      badges
    );
    expect(result).not.toContain('first-quiz');
  });

  it('US-034: does not unlock first_quiz if already unlocked', () => {
    const badges = [badge('first-quiz', 'first_quiz')];
    const result = service.evaluateAll(
      baseProgress({ unlockedBadgeIds: ['first-quiz'] }),
      baseEvent({ isFirstQuiz: true, sessionTotal: 1 }),
      badges
    );
    expect(result).not.toContain('first-quiz');
  });

  // US-035 – chapter_complete trigger
  it('US-035: unlocks chapter_complete badge when chapter is done', () => {
    const badges = [badge('ch04-complete', 'chapter_complete', { criteria: { trigger: 'chapter_complete', chapterId: 'ch04' } })];
    const progress = baseProgress({
      chapterProgress: {
        ch04: {
          chapterId: 'ch04', questionsAnswered: 5, questionsCorrect: 5,
          totalQuestions: 5, completed: true, lastAttemptAt: '',
          questionResults: {},
        },
      },
    });
    const result = service.evaluateAll(progress, baseEvent(), badges);
    expect(result).toContain('ch04-complete');
  });

  it('US-035: does not unlock chapter_complete when chapter incomplete', () => {
    const badges = [badge('ch04-complete', 'chapter_complete', { criteria: { trigger: 'chapter_complete', chapterId: 'ch04' } })];
    const progress = baseProgress({
      chapterProgress: {
        ch04: {
          chapterId: 'ch04', questionsAnswered: 3, questionsCorrect: 3,
          totalQuestions: 5, completed: false, lastAttemptAt: '',
          questionResults: {},
        },
      },
    });
    const result = service.evaluateAll(progress, baseEvent(), badges);
    expect(result).not.toContain('ch04-complete');
  });

  // US-036 – perfect_score trigger
  it('US-036: unlocks perfect_score when all session answers correct', () => {
    const badges = [badge('perfect', 'perfect_score')];
    const result = service.evaluateAll(
      baseProgress(),
      baseEvent({ sessionCorrect: 5, sessionTotal: 5, totalQuestionsInChapter: 5 }),
      badges
    );
    expect(result).toContain('perfect');
  });

  it('US-036: does not unlock perfect_score when any answer incorrect', () => {
    const badges = [badge('perfect', 'perfect_score')];
    const result = service.evaluateAll(
      baseProgress(),
      baseEvent({ sessionCorrect: 4, sessionTotal: 5, totalQuestionsInChapter: 5 }),
      badges
    );
    expect(result).not.toContain('perfect');
  });

  it('US-036: does not unlock perfect_score when session did not cover all questions', () => {
    const badges = [badge('perfect', 'perfect_score')];
    const result = service.evaluateAll(
      baseProgress(),
      baseEvent({ sessionCorrect: 3, sessionTotal: 3, totalQuestionsInChapter: 5 }),
      badges
    );
    expect(result).not.toContain('perfect');
  });

  // US-037 – streak trigger
  it('US-037: unlocks streak badge at threshold', () => {
    const badges = [badge('streak-5', 'streak', { criteria: { trigger: 'streak', threshold: 5 } })];
    const result = service.evaluateAll(baseProgress({ currentStreak: 5 }), baseEvent(), badges);
    expect(result).toContain('streak-5');
  });

  it('US-037: does not unlock streak badge below threshold', () => {
    const badges = [badge('streak-5', 'streak', { criteria: { trigger: 'streak', threshold: 5 } })];
    const result = service.evaluateAll(baseProgress({ currentStreak: 4 }), baseEvent(), badges);
    expect(result).not.toContain('streak-5');
  });

  // US-038 – total_xp trigger
  it('US-038: unlocks xp badge at threshold', () => {
    const badges = [badge('xp-100', 'total_xp', { criteria: { trigger: 'total_xp', threshold: 100 } })];
    const result = service.evaluateAll(baseProgress({ totalXP: 100 }), baseEvent(), badges);
    expect(result).toContain('xp-100');
  });

  it('US-038: does not unlock xp badge below threshold', () => {
    const badges = [badge('xp-100', 'total_xp', { criteria: { trigger: 'total_xp', threshold: 100 } })];
    const result = service.evaluateAll(baseProgress({ totalXP: 99 }), baseEvent(), badges);
    expect(result).not.toContain('xp-100');
  });

  // US-039 – questions_answered trigger
  it('US-039: unlocks questions_answered badge at threshold', () => {
    const badges = [badge('q-25', 'questions_answered', { criteria: { trigger: 'questions_answered', threshold: 25 } })];
    const result = service.evaluateAll(baseProgress({ totalQuestionsAnswered: 25 }), baseEvent(), badges);
    expect(result).toContain('q-25');
  });

  it('US-039: does not unlock questions_answered badge below threshold', () => {
    const badges = [badge('q-25', 'questions_answered', { criteria: { trigger: 'questions_answered', threshold: 25 } })];
    const result = service.evaluateAll(baseProgress({ totalQuestionsAnswered: 24 }), baseEvent(), badges);
    expect(result).not.toContain('q-25');
  });

  // US-040 – all_chapters_complete trigger
  it('US-040: unlocks all_chapters_complete when all chapters done', () => {
    const badges = [badge('all-done', 'all_chapters_complete')];
    const progress = baseProgress({
      chapterProgress: {
        ch04: { chapterId: 'ch04', questionsAnswered: 5, questionsCorrect: 5, totalQuestions: 5, completed: true, lastAttemptAt: '', questionResults: {} },
        ch05: { chapterId: 'ch05', questionsAnswered: 5, questionsCorrect: 5, totalQuestions: 5, completed: true, lastAttemptAt: '', questionResults: {} },
      },
    });
    const result = service.evaluateAll(progress, baseEvent(), badges);
    expect(result).toContain('all-done');
  });

  it('US-040: does not unlock all_chapters_complete when some chapters incomplete', () => {
    const badges = [badge('all-done', 'all_chapters_complete')];
    const progress = baseProgress({
      chapterProgress: {
        ch04: { chapterId: 'ch04', questionsAnswered: 5, questionsCorrect: 5, totalQuestions: 5, completed: true, lastAttemptAt: '', questionResults: {} },
        ch05: { chapterId: 'ch05', questionsAnswered: 3, questionsCorrect: 3, totalQuestions: 5, completed: false, lastAttemptAt: '', questionResults: {} },
      },
    });
    const result = service.evaluateAll(progress, baseEvent(), badges);
    expect(result).not.toContain('all-done');
  });

  it('US-040: does not unlock all_chapters_complete when no chapters in progress', () => {
    const badges = [badge('all-done', 'all_chapters_complete')];
    const result = service.evaluateAll(baseProgress(), baseEvent(), badges);
    expect(result).not.toContain('all-done');
  });

  // Multiple badges can unlock in one evaluation
  it('unlocks multiple badges in one call', () => {
    const badges = [
      badge('streak-5', 'streak', { criteria: { trigger: 'streak', threshold: 5 } }),
      badge('xp-100', 'total_xp', { criteria: { trigger: 'total_xp', threshold: 100 } }),
    ];
    const result = service.evaluateAll(baseProgress({ currentStreak: 5, totalXP: 100 }), baseEvent(), badges);
    expect(result).toContain('streak-5');
    expect(result).toContain('xp-100');
  });

  // Already unlocked badges are skipped
  it('skips already unlocked badges', () => {
    const badges = [badge('streak-5', 'streak', { criteria: { trigger: 'streak', threshold: 5 } })];
    const result = service.evaluateAll(
      baseProgress({ currentStreak: 5, unlockedBadgeIds: ['streak-5'] }),
      baseEvent(),
      badges
    );
    expect(result).not.toContain('streak-5');
  });
});
