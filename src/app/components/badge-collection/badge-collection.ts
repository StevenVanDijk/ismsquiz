import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';
import { Badge } from '../../models/badge.model';
import { BadgeCard } from '../badge-card/badge-card';

@Component({
  selector: 'app-badge-collection',
  imports: [CommonModule, MatIconModule, BadgeCard],
  templateUrl: './badge-collection.html',
  styleUrl: './badge-collection.scss',
})
export class BadgeCollection implements OnInit {
  private contentService = inject(ContentService);
  progressService = inject(ProgressService);

  badges = signal<Badge[]>([]);

  get unlockedCount(): number {
    return this.progressService.unlockedBadgeIds().length;
  }

  ngOnInit(): void {
    this.contentService.getAllBadges().subscribe(b => this.badges.set(b));
  }

  isUnlocked(badge: Badge): boolean {
    return this.progressService.unlockedBadgeIds().includes(badge.id);
  }
}
