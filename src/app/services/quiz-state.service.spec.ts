import { TestBed } from '@angular/core/testing';
import { QuizStateService } from './quiz-state';
import { Question } from '../models/question.model';

function makeQuestion(id: string, correctId = 'a'): Question {
  return {
    id,
    chapterId: 'ch04',
    sectionRef: '4.1',
    difficulty: 'beginner',
    question: `Question ${id}`,
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' },
    ],
    correctAnswerId: correctId,
    explanation: 'Explanation',
    xpValue: 10,
  };
}

describe('QuizStateService', () => {
  let service: QuizStateService;
  const questions = [makeQuestion('q1'), makeQuestion('q2'), makeQuestion('q3')];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [QuizStateService] });
    service = TestBed.inject(QuizStateService);
  });

  // US-023 – shuffle does not lose questions
  it('US-023: shuffled session contains all questions', () => {
    service.startSession('ch04', questions, true);
    expect(service.totalQuestions()).toBe(3);
  });

  it('US-023: startSession does not mutate original array', () => {
    const original = [...questions];
    service.startSession('ch04', questions, true);
    expect(questions).toEqual(original);
  });

  it('US-023: startSession with shuffle=false preserves order', () => {
    service.startSession('ch04', questions, false);
    expect(service.currentQuestion()?.id).toBe('q1');
  });

  // US-056 – recordAnswer returns correct result
  it('US-056: recordAnswer returns correct=true for correct answer', () => {
    service.startSession('ch04', [makeQuestion('q1', 'a')], false);
    const result = service.recordAnswer('a');
    expect(result.correct).toBe(true);
    expect(result.xpEarned).toBe(10);
  });

  it('US-056: recordAnswer returns correct=false for wrong answer', () => {
    service.startSession('ch04', [makeQuestion('q1', 'a')], false);
    const result = service.recordAnswer('b');
    expect(result.correct).toBe(false);
    expect(result.xpEarned).toBe(0);
  });

  it('US-056: sessionResults grows by 1 per answer', () => {
    service.startSession('ch04', questions, false);
    service.recordAnswer('a');
    expect(service.sessionResults().length).toBe(1);
    service.recordAnswer('a');
    expect(service.sessionResults().length).toBe(2);
  });

  // US-057 – nextQuestion advances index
  it('US-057: nextQuestion increments currentIndex', () => {
    service.startSession('ch04', questions, false);
    service.recordAnswer('a');
    service.nextQuestion();
    expect(service.currentIndex()).toBe(1);
  });

  it('US-057: isComplete becomes true after last question', () => {
    service.startSession('ch04', [makeQuestion('q1')], false);
    service.recordAnswer('a');
    service.nextQuestion();
    expect(service.isComplete()).toBe(true);
  });

  it('US-057: currentQuestion is null after completion', () => {
    service.startSession('ch04', [makeQuestion('q1')], false);
    service.recordAnswer('a');
    service.nextQuestion();
    expect(service.currentQuestion()).toBeNull();
  });

  // US-058 – getSessionScore
  it('US-058: score is 100 when all correct', () => {
    service.startSession('ch04', [makeQuestion('q1', 'a'), makeQuestion('q2', 'a')], false);
    service.recordAnswer('a');
    service.nextQuestion();
    service.recordAnswer('a');
    expect(service.getSessionScore()).toBe(100);
  });

  it('US-058: score is 0 when all incorrect', () => {
    service.startSession('ch04', [makeQuestion('q1', 'a'), makeQuestion('q2', 'a')], false);
    service.recordAnswer('b');
    service.nextQuestion();
    service.recordAnswer('b');
    expect(service.getSessionScore()).toBe(0);
  });

  it('US-058: score is 50 when half correct', () => {
    service.startSession('ch04', [makeQuestion('q1', 'a'), makeQuestion('q2', 'a')], false);
    service.recordAnswer('a'); // correct
    service.nextQuestion();
    service.recordAnswer('b'); // wrong
    expect(service.getSessionScore()).toBe(50);
  });

  it('US-058: score is 0 with no answers', () => {
    service.startSession('ch04', questions, false);
    expect(service.getSessionScore()).toBe(0);
  });

  // US-059 – isQuizActive
  it('US-059: isQuizActive is false before session starts', () => {
    expect(service.isQuizActive()).toBe(false);
  });

  it('US-059: isQuizActive is true after first answer before completion', () => {
    service.startSession('ch04', questions, false);
    service.recordAnswer('a');
    expect(service.isQuizActive()).toBe(true);
  });

  it('US-059: isQuizActive is false after quiz completes', () => {
    service.startSession('ch04', [makeQuestion('q1')], false);
    service.recordAnswer('a');
    service.nextQuestion();
    expect(service.isQuizActive()).toBe(false);
  });

  // getSessionXP
  it('getSessionXP returns sum of correct question XP', () => {
    service.startSession('ch04', [makeQuestion('q1', 'a'), makeQuestion('q2', 'a')], false);
    service.recordAnswer('a'); // +10
    service.nextQuestion();
    service.recordAnswer('b'); // 0
    expect(service.getSessionXP()).toBe(10);
  });

  // getCorrectCount
  it('getCorrectCount returns number of correct answers', () => {
    service.startSession('ch04', [makeQuestion('q1', 'a'), makeQuestion('q2', 'a')], false);
    service.recordAnswer('a');
    service.nextQuestion();
    service.recordAnswer('a');
    expect(service.getCorrectCount()).toBe(2);
  });

  // startSession resets previous state
  it('startSession resets previous session state', () => {
    service.startSession('ch04', [makeQuestion('q1')], false);
    service.recordAnswer('a');
    service.nextQuestion();
    service.startSession('ch04', questions, false);
    expect(service.currentIndex()).toBe(0);
    expect(service.sessionResults().length).toBe(0);
    expect(service.isComplete()).toBe(false);
  });
});
