import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Results } from './results';
import { ProgressService } from '../../services/progress';
import { BadgeService } from '../../services/badge';
import { QuizStateService } from '../../services/quiz-state';
import { Question } from '../../models/question.model';

const mockBadges = { badges: [] };

function makeQ(id: string, correctId = 'a'): Question {
  return {
    id, chapterId: 'ch04', sectionRef: '4.1', difficulty: 'beginner',
    question: `Q${id}`, options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }, { id: 'd', text: 'D' }],
    correctAnswerId: correctId, explanation: 'Exp', xpValue: 10,
  };
}

describe('Results', () => {
  let component: Results;
  let fixture: ComponentFixture<Results>;
  let httpMock: HttpTestingController;
  let router: Router;
  let quizState: QuizStateService;
  let progressService: ProgressService;

  function setupWithSession(correctCount: number, total: number) {
    const questions = Array.from({ length: total }, (_, i) => makeQ(`q${i}`, 'a'));
    quizState.startSession('ch04', questions, false);
    for (let i = 0; i < total; i++) {
      const answer = i < correctCount ? 'a' : 'b';
      quizState.recordAnswer(answer);
      if (i < total - 1) quizState.nextQuestion();
    }
    quizState['_isComplete'].set(true);
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Results],
      providers: [
        provideRouter([{ path: 'quiz/:chapterId', component: Results }, { path: 'chapters', component: Results }]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProgressService,
        BadgeService,
        QuizStateService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'ch04' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Results);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    quizState = TestBed.inject(QuizStateService);
    progressService = TestBed.inject(ProgressService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  function initComponent() {
    fixture.detectChanges();
    httpMock.expectOne('assets/data/badges.json').flush(mockBadges);
    fixture.detectChanges();
  }

  it('creates component', () => {
    setupWithSession(3, 3);
    initComponent();
    expect(component).toBeTruthy();
  });

  // US-024 – score
  it('US-024: score is 100 for perfect session', () => {
    setupWithSession(3, 3);
    initComponent();
    expect(component.score).toBe(100);
  });

  it('US-024: score is 0 for all-wrong session', () => {
    setupWithSession(0, 3);
    initComponent();
    expect(component.score).toBe(0);
  });

  it('US-024: correctCount and totalCount are set', () => {
    setupWithSession(2, 3);
    initComponent();
    expect(component.correctCount).toBe(2);
    expect(component.totalCount).toBe(3);
  });

  // US-025 – emoji and message
  it('US-025: emoji is trophy for 100%', () => {
    setupWithSession(3, 3);
    initComponent();
    expect(component.emoji).toBe('🏆');
  });

  it('US-025: emoji is star for 80%', () => {
    setupWithSession(4, 5);
    initComponent();
    expect(component.emoji).toBe('🌟');
  });

  it('US-025: emoji is thumbs up for 60%', () => {
    setupWithSession(3, 5);
    initComponent();
    expect(component.emoji).toBe('👍');
  });

  it('US-025: emoji is book for below 60%', () => {
    setupWithSession(1, 5);
    initComponent();
    expect(component.emoji).toBe('📚');
  });

  it('US-025: message is correct for 100%', () => {
    setupWithSession(3, 3);
    initComponent();
    expect(component.message).toBe('Perfect! Uitstekend gedaan!');
  });

  it('US-025: message is correct for < 60%', () => {
    setupWithSession(0, 3);
    initComponent();
    expect(component.message).toBe('Blijf oefenen, je komt er!');
  });

  // US-026 – XP earned
  it('US-026: xpEarned is sum of correct question XP', () => {
    setupWithSession(2, 3);
    initComponent();
    expect(component.xpEarned).toBe(20);
  });

  // US-027 – newly unlocked badges cleared
  it('US-027: clearNewlyUnlocked called on init', () => {
    const clearSpy = vi.spyOn(progressService, 'clearNewlyUnlocked');
    setupWithSession(1, 1);
    initComponent();
    expect(clearSpy).toHaveBeenCalled();
  });

  // US-028 – sessionResults
  it('US-028: sessionResults contains all answers', () => {
    setupWithSession(2, 3);
    initComponent();
    expect(component.sessionResults.length).toBe(3);
  });

  // US-029 – retryQuiz navigates
  it('US-029: retryQuiz navigates to /quiz/ch04', () => {
    setupWithSession(1, 1);
    initComponent();
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.retryQuiz();
    expect(navigateSpy).toHaveBeenCalledWith(['/quiz', 'ch04']);
  });

  // US-030 – goToChapters navigates
  it('US-030: goToChapters navigates to /chapters', () => {
    setupWithSession(1, 1);
    initComponent();
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.goToChapters();
    expect(navigateSpy).toHaveBeenCalledWith(['/chapters']);
  });
});
