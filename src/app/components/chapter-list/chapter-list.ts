import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';
import { Chapter } from '../../models/chapter.model';
import { ProgressBar } from '../progress-bar/progress-bar';

@Component({
  selector: 'app-chapter-list',
  imports: [CommonModule, MatIconModule, MatButtonModule, ProgressBar],
  templateUrl: './chapter-list.html',
  styleUrl: './chapter-list.scss',
})
export class ChapterList implements OnInit {
  private router = inject(Router);
  private contentService = inject(ContentService);
  progressService = inject(ProgressService);

  chapters = signal<Chapter[]>([]);

  ngOnInit(): void {
    this.contentService.getChapters().subscribe(ch => this.chapters.set(ch));
  }

  chapterPct(id: string): number {
    return this.progressService.getChapterPercentage(id);
  }

  isCompleted(id: string): boolean {
    return this.progressService.getChapterProgress(id)?.completed ?? false;
  }

  navigate(id: string): void {
    this.router.navigate(['/chapters', id]);
  }
}
