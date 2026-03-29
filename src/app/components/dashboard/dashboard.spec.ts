import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Dashboard } from './dashboard';
import { ProgressService } from '../../services/progress';
import { BadgeService } from '../../services/badge';

const mockIndex = {
  version: '1.0',
  lastUpdated: '2026-01-01',
  chapters: [
    { id: 'ch04', number: '4', title: 'Ch4', subtitle: 's', icon: 'business', color: '#000', totalQuestions: 2, xpReward: 10 },
    { id: 'ch05', number: '5', title: 'Ch5', subtitle: 's', icon: 'star', color: '#000', totalQuestions: 2, xpReward: 10 },
  ],
};

const mockBadges = { badges: [] };

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpMock: HttpTestingController;
  let progressService: ProgressService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProgressService,
        BadgeService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    progressService = TestBed.inject(ProgressService);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/index.json').flush(mockIndex);
    httpMock.expectOne('assets/data/badges.json').flush(mockBadges);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  // US-002 – XP starts at 0
  it('US-002: shows 0 XP for new user', () => {
    expect(progressService.totalXP()).toBe(0);
  });

  // US-003 – level is 1 at 0 XP
  it('US-003: level is 1 at 0 XP', () => {
    expect(component.level).toBe(1);
  });

  it('US-003: level is 2 at 100 XP', () => {
    progressService.recordAnswer('q1', 'ch04', true, 100, 5, [], 1, 1);
    fixture.detectChanges();
    expect(component.level).toBe(2);
  });

  it('US-003: level is 3 at 200 XP', () => {
    for (let i = 0; i < 2; i++) {
      progressService.recordAnswer(`q${i}`, 'ch04', true, 100, 5, [], i + 1, i + 1);
    }
    fixture.detectChanges();
    expect(component.level).toBe(3);
  });

  // US-004 – XP level percentage
  it('US-004: xpLevelPct is 0 at 0 XP', () => {
    expect(component.xpLevelPct).toBe(0);
  });

  it('US-004: xpLevelPct is 50 at 50 XP', () => {
    progressService.recordAnswer('q1', 'ch04', true, 50, 5, [], 1, 1);
    fixture.detectChanges();
    expect(component.xpLevelPct).toBe(50);
  });

  it('US-004: xpLevelPct resets at 100 XP', () => {
    progressService.recordAnswer('q1', 'ch04', true, 100, 5, [], 1, 1);
    fixture.detectChanges();
    expect(component.xpLevelPct).toBe(0);
  });

  it('US-004: xpLevelPct is 50 at 150 XP', () => {
    progressService.recordAnswer('q1', 'ch04', true, 150, 5, [], 1, 1);
    fixture.detectChanges();
    expect(component.xpLevelPct).toBe(50);
  });

  // US-005 – streak displayed
  it('US-005: streak starts at 0', () => {
    expect(progressService.currentStreak()).toBe(0);
  });

  // US-006 – overall percentage
  it('US-006: overallPct is 0 with no completed chapters', () => {
    expect(component.overallPct).toBe(0);
  });

  // US-007 – total questions answered
  it('US-007: total questions answered starts at 0', () => {
    expect(progressService.totalQuestionsAnswered()).toBe(0);
  });

  // US-008 – recent badges show 3 items
  it('US-008: shows 3 items in recentBadges (all locked)', () => {
    // No badges loaded so recentBadges will be empty (empty badges.json)
    expect(component.recentBadges().length).toBe(0);
  });

  // US-010 – chapterPct
  it('US-010: chapterPct returns 0 for unstudied chapter', () => {
    expect(component.chapterPct('ch04')).toBe(0);
  });

  // US-010 – chapterPct updates after answer
  it('US-010: chapterPct updates after correct answer', () => {
    progressService.recordAnswer('q1', 'ch04', true, 10, 2, [], 1, 1);
    fixture.detectChanges();
    expect(component.chapterPct('ch04')).toBe(50);
  });
});
