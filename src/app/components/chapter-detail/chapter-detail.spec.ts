import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChapterDetail } from './chapter-detail';
import { ProgressService } from '../../services/progress';
import { BadgeService } from '../../services/badge';

const mockIndex = {
  version: '1.0',
  lastUpdated: '2026-01-01',
  chapters: [
    { id: 'ch04', number: '4', title: 'Ch4', subtitle: 'sub', icon: 'business', color: '#1565C0', totalQuestions: 3, xpReward: 10 },
  ],
};

describe('ChapterDetail', () => {
  let component: ChapterDetail;
  let fixture: ComponentFixture<ChapterDetail>;
  let httpMock: HttpTestingController;
  let progressService: ProgressService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ChapterDetail],
      providers: [
        provideRouter([{ path: 'quiz/:chapterId', component: ChapterDetail }]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProgressService,
        BadgeService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'ch04' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterDetail);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    progressService = TestBed.inject(ProgressService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    httpMock.expectOne('assets/data/index.json').flush(mockIndex);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  // US-014 – chapter loaded
  it('US-014: loads chapter from route param', () => {
    expect(component.chapter()?.id).toBe('ch04');
  });

  // US-014 – pct starts at 0
  it('US-014: pct is 0 for unstarted chapter', () => {
    expect(component.pct).toBe(0);
  });

  // US-015 – isCompleted false by default
  it('US-015: isCompleted is false initially', () => {
    expect(component.isCompleted).toBe(false);
  });

  // US-015 – isCompleted true when chapter done
  it('US-015: isCompleted is true when all questions answered correctly', () => {
    progressService.recordAnswer('q1', 'ch04', true, 10, 3, [], 1, 1);
    progressService.recordAnswer('q2', 'ch04', true, 10, 3, [], 2, 2);
    progressService.recordAnswer('q3', 'ch04', true, 10, 3, [], 3, 3);
    fixture.detectChanges();
    expect(component.isCompleted).toBe(true);
  });

  // US-015 – startQuiz navigates to quiz route
  it('US-015: startQuiz navigates to /quiz/:chapterId', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.startQuiz();
    expect(navigateSpy).toHaveBeenCalledWith(['/quiz', 'ch04']);
  });

  // US-014 – pct updates after answers
  it('US-014: pct updates as questions are answered correctly', () => {
    progressService.recordAnswer('q1', 'ch04', true, 10, 3, [], 1, 1);
    fixture.detectChanges();
    expect(component.pct).toBeGreaterThan(0);
  });
});
