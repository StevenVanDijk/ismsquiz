import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';
import { QuizStateService } from '../../services/quiz-state';
import { Question } from '../../models/question.model';
import { Badge } from '../../models/badge.model';
import { QuestionCard, FeedbackState } from '../question-card/question-card';
import { ProgressBar } from '../progress-bar/progress-bar';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, QuestionCard, ProgressBar],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  private progressService = inject(ProgressService);
  quizState = inject(QuizStateService);

  loading = signal(true);
  feedbackState = signal<FeedbackState>('none');
  selectedAnswerId = signal<string | null>(null);
  allBadges = signal<Badge[]>([]);
  totalQuestionsInChapter = signal(0);
  chapterId = '';

  ngOnInit(): void {
    this.chapterId = this.route.snapshot.paramMap.get('chapterId') ?? '';

    this.contentService.getAllBadges().subscribe(badges => {
      this.allBadges.set(badges);
    });

    this.contentService.getChapter(this.chapterId).subscribe(chapter => {
      this.totalQuestionsInChapter.set(chapter?.totalQuestions ?? 0);
    });

    this.contentService.getQuestions(this.chapterId).subscribe(questions => {
      this.quizState.startSession(this.chapterId, questions);
      this.loading.set(false);
    });
  }

  onAnswerSelected(optionId: string): void {
    if (this.feedbackState() !== 'none') return;

    this.selectedAnswerId.set(optionId);
    const result = this.quizState.recordAnswer(optionId);
    this.feedbackState.set(result.correct ? 'correct' : 'incorrect');

    const sessionResults = this.quizState.sessionResults();
    const sessionCorrect = sessionResults.filter(r => r.correct).length;

    this.progressService.recordAnswer(
      result.question.id,
      this.chapterId,
      result.correct,
      result.question.xpValue,
      this.totalQuestionsInChapter(),
      this.allBadges(),
      sessionCorrect,
      sessionResults.length
    );
  }

  nextQuestion(): void {
    this.quizState.nextQuestion();
    this.feedbackState.set('none');
    this.selectedAnswerId.set(null);

    if (this.quizState.isComplete()) {
      this.router.navigate(['/results', this.chapterId]);
    }
  }

  get progressValue(): number {
    const total = this.quizState.totalQuestions();
    if (total === 0) return 0;
    return Math.round((this.quizState.currentIndex() / total) * 100);
  }

  isQuizActive(): boolean {
    return this.quizState.isQuizActive();
  }
}
