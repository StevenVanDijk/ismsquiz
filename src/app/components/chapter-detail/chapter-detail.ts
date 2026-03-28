import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../../services/content';
import { ProgressService } from '../../services/progress';
import { Chapter } from '../../models/chapter.model';
import { ProgressBar } from '../progress-bar/progress-bar';

@Component({
  selector: 'app-chapter-detail',
  imports: [CommonModule, MatButtonModule, MatIconModule, ProgressBar],
  templateUrl: './chapter-detail.html',
  styleUrl: './chapter-detail.scss',
})
export class ChapterDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  progressService = inject(ProgressService);

  chapter = signal<Chapter | null>(null);

  get pct(): number {
    const id = this.chapter()?.id;
    return id ? this.progressService.getChapterPercentage(id) : 0;
  }

  get isCompleted(): boolean {
    const id = this.chapter()?.id;
    return id ? (this.progressService.getChapterProgress(id)?.completed ?? false) : false;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.contentService.getChapter(id).subscribe(ch => this.chapter.set(ch ?? null));
  }

  startQuiz(): void {
    const id = this.chapter()?.id;
    if (id) this.router.navigate(['/quiz', id]);
  }
}
