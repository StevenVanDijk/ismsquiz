import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Quiz } from './quiz';
import { ProgressService } from '../../services/progress';
import { BadgeService } from '../../services/badge';
import { QuizStateService } from '../../services/quiz-state';
import { Question } from '../../models/question.model';

const mockIndex = {
  version: '1.0', lastUpdated: '2026-01-01',
  chapters: [{ id: 'ch04', number: '4', title: 'Ch4', subtitle: 's', icon: 'business', color: '#000', totalQuestions: 2, xpReward: 10 }],
};

const mockQuestions = {
  chapterId: 'ch04', title: 'Ch4',
  questions: [
    { id: 'q1', chapterId: 'ch04', sectionRef: '4.1', difficulty: 'beginner', question: 'Q1?',
      options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }, { id: 'd', text: 'D' }],
      correctAnswerId: 'a', explanation: 'Exp', xpValue: 10 },
    { id: 'q2', chapterId: 'ch04', sectionRef: '4.2', difficulty: 'intermediate', question: 'Q2?',
      options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }, { id: 'd', text: 'D' }],
      correctAnswerId: 'b', explanation: 'Exp', xpValue: 10 },
  ],
};

const mockBadges = { badges: [] };

describe('Quiz', () => {
  let component: Quiz;
  let fixture: ComponentFixture<Quiz>;
  let httpMock: HttpTestingController;
  let router: Router;
  let quizState: QuizStateService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Quiz],
      providers: [
        provideRouter([{ path: 'results/:chapterId', component: Quiz }]),
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

    fixture = TestBed.createComponent(Quiz);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    quizState = TestBed.inject(QuizStateService);
    fixture.detectChanges();
    // Flush HTTP requests
    httpMock.expectOne('assets/data/badges.json').flush(mockBadges);
    httpMock.expectOne('assets/data/index.json').flush(mockIndex);
    httpMock.expectOne('assets/data/chapters/chapter-04.json').flush(mockQuestions);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  // US-016 – questions loaded
  it('US-016: loading is false after questions loaded', () => {
    expect(component.loading()).toBe(false);
  });

  it('US-016: quiz state has questions loaded', () => {
    expect(quizState.totalQuestions()).toBe(2);
  });

  // US-017 – progress value
  it('US-017: progressValue is 0 at start', () => {
    expect(component.progressValue).toBe(0);
  });

  it('US-017: progressValue increases after answering', () => {
    component.onAnswerSelected('a');
    component.nextQuestion();
    fixture.detectChanges();
    expect(component.progressValue).toBeGreaterThan(0);
  });

  // US-018 – answer selection sets feedbackState
  it('US-018: selecting answer sets feedbackState', () => {
    component.onAnswerSelected('a');
    expect(component.feedbackState()).not.toBe('none');
  });

  it('US-018: re-selecting answer while feedback shown is ignored', () => {
    component.onAnswerSelected('a');
    const stateAfterFirst = component.feedbackState();
    component.onAnswerSelected('b');
    expect(component.feedbackState()).toBe(stateAfterFirst);
  });

  // US-019 – correct answer sets correct feedback
  it('US-019: correct answer sets feedbackState to correct', () => {
    // questions are shuffled, but we access quizState directly
    const q = quizState.currentQuestion();
    component.onAnswerSelected(q!.correctAnswerId);
    expect(component.feedbackState()).toBe('correct');
  });

  it('US-019: wrong answer sets feedbackState to incorrect', () => {
    const q = quizState.currentQuestion();
    const wrongId = q!.options.find(o => o.id !== q!.correctAnswerId)!.id;
    component.onAnswerSelected(wrongId);
    expect(component.feedbackState()).toBe('incorrect');
  });

  // US-020 – XP earned
  it('US-020: selectedAnswerId is set after answer', () => {
    const q = quizState.currentQuestion();
    component.onAnswerSelected(q!.correctAnswerId);
    expect(component.selectedAnswerId()).toBe(q!.correctAnswerId);
  });

  // US-021 – next question clears feedback
  it('US-021: nextQuestion resets feedbackState to none', () => {
    component.onAnswerSelected(quizState.currentQuestion()!.correctAnswerId);
    component.nextQuestion();
    fixture.detectChanges();
    if (!quizState.isComplete()) {
      expect(component.feedbackState()).toBe('none');
    }
  });

  // US-022 – after last question navigates to results
  it('US-022: navigates to results after last question', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    // Answer all questions
    for (let i = 0; i < 2; i++) {
      component.onAnswerSelected(quizState.currentQuestion()!.correctAnswerId);
      component.nextQuestion();
      fixture.detectChanges();
    }
    expect(navigateSpy).toHaveBeenCalledWith(['/results', 'ch04']);
  });

  // US-059 – isQuizActive delegates to quiz state
  it('US-059: isQuizActive returns false before answering', () => {
    expect(component.isQuizActive()).toBe(false);
  });

  it('US-059: isQuizActive returns true after first answer', () => {
    component.onAnswerSelected('a');
    expect(component.isQuizActive()).toBe(true);
  });
});
