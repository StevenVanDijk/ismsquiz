import { Injectable, signal, computed } from '@angular/core';
import { Question } from '../models/question.model';

export interface SessionResult {
  question: Question;
  selectedAnswerId: string;
  correct: boolean;
  xpEarned: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

@Injectable({ providedIn: 'root' })
export class QuizStateService {
  private _questions = signal<Question[]>([]);
  private _currentIndex = signal(0);
  private _sessionResults = signal<SessionResult[]>([]);
  private _isComplete = signal(false);
  private _chapterId = signal('');

  readonly currentQuestion = computed(() => {
    const qs = this._questions();
    const i = this._currentIndex();
    return qs.length > 0 && i < qs.length ? qs[i] : null;
  });

  readonly currentIndex = computed(() => this._currentIndex());
  readonly totalQuestions = computed(() => this._questions().length);
  readonly sessionResults = computed(() => this._sessionResults());
  readonly isComplete = computed(() => this._isComplete());
  readonly chapterId = computed(() => this._chapterId());

  startSession(chapterId: string, questions: Question[], doShuffle = true): void {
    this._chapterId.set(chapterId);
    this._questions.set(doShuffle ? shuffle(questions) : questions);
    this._currentIndex.set(0);
    this._sessionResults.set([]);
    this._isComplete.set(false);
  }

  recordAnswer(selectedAnswerId: string): SessionResult {
    const q = this.currentQuestion()!;
    const correct = selectedAnswerId === q.correctAnswerId;
    const result: SessionResult = {
      question: q,
      selectedAnswerId,
      correct,
      xpEarned: correct ? q.xpValue : 0,
    };
    this._sessionResults.update(prev => [...prev, result]);
    return result;
  }

  nextQuestion(): void {
    const next = this._currentIndex() + 1;
    if (next >= this._questions().length) {
      this._isComplete.set(true);
    } else {
      this._currentIndex.set(next);
    }
  }

  getSessionScore(): number {
    const results = this._sessionResults();
    if (results.length === 0) return 0;
    return Math.round((results.filter(r => r.correct).length / results.length) * 100);
  }

  getSessionXP(): number {
    return this._sessionResults().reduce((sum, r) => sum + r.xpEarned, 0);
  }

  getCorrectCount(): number {
    return this._sessionResults().filter(r => r.correct).length;
  }

  isQuizActive(): boolean {
    return this._sessionResults().length > 0 && !this._isComplete();
  }
}
