import { TestBed } from '@angular/core/testing';
import { ProgressService } from './progress';
import { BadgeService } from './badge';
import { Badge } from '../models/badge.model';

const STORAGE_KEY = 'nen7510_progress_v1';

function makeBadge(id: string, trigger: string, opts: Partial<Badge> = {}): Badge {
  return {
    id,
    name: id,
    description: id,
    icon: 'star',
    color: '#fff',
    sortOrder: 0,
    criteria: { trigger: trigger as any, ...opts.criteria },
    ...opts,
  } as Badge;
}

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [ProgressService, BadgeService] });
    service = TestBed.inject(ProgressService);
  });

  afterEach(() => localStorage.clear());

  // US-005 – streak increments on correct answer
  it('US-005: increments streak on correct answer', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 1, 1);
    expect(service.currentStreak()).toBe(1);
  });

  // US-005 – streak resets on incorrect answer
  it('US-005: resets streak to 0 on incorrect answer', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 1, 1);
    service.recordAnswer('q2', 'ch04', false, 10, 5, [], 1, 2);
    expect(service.currentStreak()).toBe(0);
  });

  // US-005 – streak accumulates across multiple correct answers
  it('US-005: streak accumulates across correct answers', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 1, 1);
    service.recordAnswer('q2', 'ch04', true, 10, 5, [], 2, 2);
    service.recordAnswer('q3', 'ch04', true, 10, 5, [], 3, 3);
    expect(service.currentStreak()).toBe(3);
  });

  // US-006 – overall percentage with no completed chapters
  it('US-006: returns 0% overall when no chapters completed', () => {
    expect(service.getOverallPercentage(['ch04', 'ch05'])).toBe(0);
  });

  // US-006 – overall percentage with some chapters completed
  it('US-006: returns correct overall percentage', () => {
    // Mark ch04 complete by answering all questions correctly
    service.recordAnswer('q1', 'ch04', true, 10, 1, [], 1, 1);
    expect(service.getOverallPercentage(['ch04', 'ch05'])).toBe(50);
  });

  // US-006 – empty chapterIds returns 0
  it('US-006: returns 0% for empty chapter list', () => {
    expect(service.getOverallPercentage([])).toBe(0);
  });

  // US-012 – chapter is not complete until all correct
  it('US-012: chapter not complete until all questions answered correctly', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 2, [], 1, 1);
    expect(service.getChapterProgress('ch04')?.completed).toBe(false);
  });

  // US-012 – chapter completes when all correct
  it('US-012: chapter completes when last question answered correctly', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 2, [], 1, 1);
    service.recordAnswer('q2', 'ch04', true, 10, 2, [], 2, 2);
    expect(service.getChapterProgress('ch04')?.completed).toBe(true);
  });

  // US-027 – newly unlocked badges cleared after results page
  it('US-027: clearNewlyUnlocked empties newlyUnlockedBadgeIds', () => {
    const badges = [makeBadge('first-quiz', 'first_quiz')];
    service.recordAnswer('q1', 'ch04', true, 10, 5, badges, 1, 1);
    expect(service.newlyUnlockedBadgeIds().length).toBeGreaterThan(0);
    service.clearNewlyUnlocked();
    expect(service.newlyUnlockedBadgeIds()).toEqual([]);
  });

  // US-034 – first quiz badge unlocked on very first answer
  it('US-034: first-quiz badge unlocked on first answer', () => {
    const badges = [makeBadge('first-quiz', 'first_quiz')];
    const newBadges = service.recordAnswer('q1', 'ch04', true, 10, 5, badges, 1, 1);
    expect(newBadges).toContain('first-quiz');
  });

  // US-034 – first quiz badge not unlocked on second answer
  it('US-034: first-quiz badge not unlocked on subsequent answer', () => {
    const badges = [makeBadge('first-quiz', 'first_quiz')];
    service.recordAnswer('q1', 'ch04', true, 10, 5, badges, 1, 1);
    const newBadges = service.recordAnswer('q2', 'ch04', true, 10, 5, badges, 2, 2);
    expect(newBadges).not.toContain('first-quiz');
  });

  // US-035 – chapter complete badge unlocked
  it('US-035: chapter-complete badge unlocked when chapter done', () => {
    const badges = [makeBadge('ch04-complete', 'chapter_complete', { criteria: { trigger: 'chapter_complete', chapterId: 'ch04' } })];
    service.recordAnswer('q1', 'ch04', true, 10, 1, badges, 1, 1);
    expect(service.unlockedBadgeIds()).toContain('ch04-complete');
  });

  // US-037 – streak badge unlocked
  it('US-037: streak badge unlocked at threshold', () => {
    const badges = [makeBadge('streak-5', 'streak', { criteria: { trigger: 'streak', threshold: 5 } })];
    for (let i = 0; i < 5; i++) {
      service.recordAnswer(`q${i}`, 'ch04', true, 10, 10, badges, i + 1, i + 1);
    }
    expect(service.unlockedBadgeIds()).toContain('streak-5');
  });

  // US-041 – XP only awarded once per question
  it('US-041: XP awarded only once for a question answered correctly', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 1, 1);
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 2, 2);
    expect(service.totalXP()).toBe(10);
  });

  // US-041 – no XP for incorrect answer
  it('US-041: no XP for incorrect answer', () => {
    service.recordAnswer('q1', 'ch04', false, 10, 5, [], 0, 1);
    expect(service.totalXP()).toBe(0);
  });

  // US-042 – progress persists in localStorage
  it('US-042: progress saved to localStorage after answer', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 1, 1);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.totalXP).toBe(10);
  });

  // US-042 – progress reloaded from localStorage on init
  it('US-042: progress restored from localStorage on service init', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 1, 1);
    // Re-create service (simulating app reload)
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [ProgressService, BadgeService] });
    const newService = TestBed.inject(ProgressService);
    expect(newService.totalXP()).toBe(10);
  });

  // US-043 – corrupted storage returns default progress
  it('US-043: corrupted localStorage returns default progress', () => {
    localStorage.setItem(STORAGE_KEY, 'NOT_VALID_JSON{{{');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [ProgressService, BadgeService] });
    const newService = TestBed.inject(ProgressService);
    expect(newService.totalXP()).toBe(0);
  });

  // US-043 – version mismatch returns default progress
  it('US-043: version mismatch returns default progress', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, totalXP: 999 }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [ProgressService, BadgeService] });
    const newService = TestBed.inject(ProgressService);
    expect(newService.totalXP()).toBe(0);
  });

  // US-060 – question answered wrong then right eventually marks chapter correct
  it('US-060: question answered wrong then right eventually completes chapter', () => {
    service.recordAnswer('q1', 'ch04', false, 10, 1, [], 0, 1);
    expect(service.getChapterProgress('ch04')?.completed).toBe(false);
    service.recordAnswer('q1', 'ch04', true, 10, 1, [], 1, 1);
    expect(service.getChapterProgress('ch04')?.completed).toBe(true);
  });

  // getChapterPercentage – returns 0 for unknown chapter
  it('returns 0% for unknown chapter', () => {
    expect(service.getChapterPercentage('unknown')).toBe(0);
  });

  // getChapterProgress – returns undefined for unstarted chapter
  it('returns undefined for unstarted chapter', () => {
    expect(service.getChapterProgress('ch99')).toBeUndefined();
  });

  // longestStreak updates correctly
  it('tracks longest streak', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 1, 1);
    service.recordAnswer('q2', 'ch04', true, 10, 5, [], 2, 2);
    service.recordAnswer('q3', 'ch04', false, 10, 5, [], 2, 3);
    expect(service.progress().longestStreak).toBe(2);
    expect(service.currentStreak()).toBe(0);
  });

  // resetProgress clears everything
  it('resetProgress clears all state', () => {
    service.recordAnswer('q1', 'ch04', true, 10, 5, [], 1, 1);
    service.resetProgress();
    expect(service.totalXP()).toBe(0);
    expect(service.currentStreak()).toBe(0);
    expect(service.unlockedBadgeIds()).toEqual([]);
  });
});
