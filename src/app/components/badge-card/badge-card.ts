import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Badge } from '../../models/badge.model';

@Component({
  selector: 'app-badge-card',
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './badge-card.html',
  styleUrl: './badge-card.scss',
})
export class BadgeCard {
  @Input() badge!: Badge;
  @Input() unlocked = false;
  @Input() compact = false;
  @Input() highlight = false;
}
