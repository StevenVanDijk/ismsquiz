import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChapterList } from './chapter-list';
import { ProgressService } from '../../services/progress';
import { BadgeService } from '../../services/badge';

const mockIndex = {
  version: '1.0',
  lastUpdated: '2026-01-01',
  chapters: [
    { id: 'ch04', number: '4', title: 'Ch4', subtitle: 'sub', icon: 'business', color: '#000', totalQuestions: 2, xpReward: 10 },
    { id: 'ch05', number: '5', title: 'Ch5', subtitle: 'sub', icon: 'star', color: '#000', totalQuestions: 2, xpReward: 10 },
  ],
};

describe('ChapterList', () => {
  let component: ChapterList;
  let fixture: ComponentFixture<ChapterList>;
  let httpMock: HttpTestingController;
  let progressService: ProgressService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ChapterList],
      providers: [
        provideRouter([{ path: 'chapters/:id', component: ChapterList }]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProgressService,
        BadgeService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterList);
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

  // US-011 – all chapters loaded
  it('US-011: loads all chapters from content service', () => {
    expect(component.chapters().length).toBe(2);
  });

  // US-012 – isCompleted false by default
  it('US-012: isCompleted returns false for unstudied chapter', () => {
    expect(component.isCompleted('ch04')).toBe(false);
  });

  // US-012 – isCompleted true when chapter done
  it('US-012: isCompleted returns true when all questions answered correctly', () => {
    progressService.recordAnswer('q1', 'ch04', true, 10, 2, [], 1, 1);
    progressService.recordAnswer('q2', 'ch04', true, 10, 2, [], 2, 2);
    fixture.detectChanges();
    expect(component.isCompleted('ch04')).toBe(true);
  });

  // US-013 – navigate called with chapter id
  it('US-013: navigate routes to /chapters/:id', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.navigate('ch04');
    expect(navigateSpy).toHaveBeenCalledWith(['/chapters', 'ch04']);
  });

  // US-012 – chapterPct returns percentage
  it('US-012: chapterPct returns correct percentage', () => {
    progressService.recordAnswer('q1', 'ch04', true, 10, 2, [], 1, 1);
    fixture.detectChanges();
    expect(component.chapterPct('ch04')).toBe(50);
  });

  it('chapterPct returns 0 for unknown chapter', () => {
    expect(component.chapterPct('unknown')).toBe(0);
  });
});
