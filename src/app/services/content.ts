import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { ChapterIndex, Chapter } from '../models/chapter.model';
import { ChapterQuestions, Question } from '../models/question.model';
import { BadgeCollection, Badge } from '../models/badge.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);

  private chapterIndex$?: Observable<ChapterIndex>;
  private questionsCache = new Map<string, Observable<Question[]>>();
  private badges$?: Observable<Badge[]>;

  getChapterIndex(): Observable<ChapterIndex> {
    if (!this.chapterIndex$) {
      this.chapterIndex$ = this.http
        .get<ChapterIndex>('assets/data/index.json')
        .pipe(shareReplay(1));
    }
    return this.chapterIndex$;
  }

  getChapters(): Observable<Chapter[]> {
    return this.getChapterIndex().pipe(map(i => i.chapters));
  }

  getChapter(id: string): Observable<Chapter | undefined> {
    return this.getChapters().pipe(map(chs => chs.find(c => c.id === id)));
  }

  getQuestions(chapterId: string): Observable<Question[]> {
    if (!this.questionsCache.has(chapterId)) {
      const url = chapterId === 'annex-a'
        ? 'assets/data/chapters/annex-a.json'
        : `assets/data/chapters/chapter-${chapterId.replace('ch', '')}.json`;
      const obs$ = this.http
        .get<ChapterQuestions>(url)
        .pipe(map(r => r.questions), shareReplay(1));
      this.questionsCache.set(chapterId, obs$);
    }
    return this.questionsCache.get(chapterId)!;
  }

  getAllBadges(): Observable<Badge[]> {
    if (!this.badges$) {
      this.badges$ = this.http
        .get<BadgeCollection>('assets/data/badges.json')
        .pipe(map(r => r.badges.sort((a, b) => a.sortOrder - b.sortOrder)), shareReplay(1));
    }
    return this.badges$;
  }
}
