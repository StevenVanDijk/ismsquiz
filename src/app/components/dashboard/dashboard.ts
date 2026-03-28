import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';
import { Chapter } from '../../models/chapter.model';
import { Badge } from '../../models/badge.model';
import { ProgressBar } from '../progress-bar/progress-bar';
import { BadgeCard } from '../badge-card/badge-card';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, ProgressBar, BadgeCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  router = inject(Router);
  private contentService = inject(ContentService);
  progressService = inject(ProgressService);

  chapters = signal<Chapter[]>([]);
  recentBadges = signal<{ badge: Badge; unlocked: boolean }[]>([]);

  get overallPct(): number {
    return this.progressService.getOverallPercentage(this.chapters().map(c => c.id));
  }

  get xpToNextLevel(): number {
    const xp = this.progressService.totalXP();
    return Math.ceil((xp + 100) / 100) * 100;
  }

  get xpLevelPct(): number {
    const xp = this.progressService.totalXP();
    const levelStart = Math.floor(xp / 100) * 100;
    return Math.round(((xp - levelStart) / 100) * 100);
  }

  get level(): number {
    return Math.floor(this.progressService.totalXP() / 100) + 1;
  }

  ngOnInit(): void {
    this.contentService.getChapters().subscribe(ch => this.chapters.set(ch));
    this.contentService.getAllBadges().subscribe(badges => {
      const unlocked = this.progressService.unlockedBadgeIds();
      const recent = badges
        .filter(b => unlocked.includes(b.id))
        .slice(-3)
        .map(b => ({ badge: b, unlocked: true }));
      const locked = badges
        .filter(b => !unlocked.includes(b.id))
        .slice(0, Math.max(0, 3 - recent.length))
        .map(b => ({ badge: b, unlocked: false }));
      this.recentBadges.set([...recent, ...locked]);
    });
  }

  chapterPct(id: string): number {
    return this.progressService.getChapterPercentage(id);
  }
}
