import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { QuizStateService, SessionResult } from '../../services/quiz-state';
import { ProgressService } from '../../services/progress';
import { ContentService } from '../../services/content';
import { Badge } from '../../models/badge.model';
import { BadgeCard } from '../badge-card/badge-card';
import { ProgressBar } from '../progress-bar/progress-bar';
import { FindOptionPipe } from '../../pipes/find-option-pipe';

@Component({
  selector: 'app-results',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, BadgeCard, FindOptionPipe],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizState = inject(QuizStateService);
  progressService = inject(ProgressService);
  private contentService = inject(ContentService);

  chapterId = '';
  score = 0;
  xpEarned = 0;
  correctCount = 0;
  totalCount = 0;
  sessionResults: SessionResult[] = [];
  newlyUnlockedBadges = signal<Badge[]>([]);
  allBadges = signal<Badge[]>([]);

  get emoji(): string {
    if (this.score === 100) return '🏆';
    if (this.score >= 80) return '🌟';
    if (this.score >= 60) return '👍';
    return '📚';
  }

  get message(): string {
    if (this.score === 100) return 'Perfect! Uitstekend gedaan!';
    if (this.score >= 80) return 'Geweldig resultaat!';
    if (this.score >= 60) return 'Goed bezig!';
    return 'Blijf oefenen, je komt er!';
  }

  ngOnInit(): void {
    this.chapterId = this.route.snapshot.paramMap.get('chapterId') ?? '';
    this.score = this.quizState.getSessionScore();
    this.xpEarned = this.quizState.getSessionXP();
    this.correctCount = this.quizState.getCorrectCount();
    this.totalCount = this.quizState.totalQuestions();
    this.sessionResults = this.quizState.sessionResults();

    this.contentService.getAllBadges().subscribe(badges => {
      this.allBadges.set(badges);
      const newIds = this.progressService.newlyUnlockedBadgeIds();
      this.newlyUnlockedBadges.set(badges.filter(b => newIds.includes(b.id)));
      this.progressService.clearNewlyUnlocked();
    });
  }

  goToChapters(): void {
    this.router.navigate(['/chapters']);
  }

  retryQuiz(): void {
    this.router.navigate(['/quiz', this.chapterId]);
  }
}
