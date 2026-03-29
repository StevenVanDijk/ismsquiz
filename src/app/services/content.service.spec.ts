import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ContentService } from './content';
import { ChapterIndex } from '../models/chapter.model';
import { ChapterQuestions } from '../models/question.model';
import { BadgeCollection } from '../models/badge.model';

const mockIndex: ChapterIndex = {
  version: '1.0.0',
  lastUpdated: '2026-01-01',
  chapters: [
    { id: 'ch04', number: '4', title: 'Organisatorische context', subtitle: 'sub', icon: 'business', color: '#000', totalQuestions: 5, xpReward: 10 },
    { id: 'annex-a', number: 'A', title: 'Bijlage A', subtitle: 'sub', icon: 'security', color: '#000', totalQuestions: 8, xpReward: 15 },
  ],
};

const mockQuestions: ChapterQuestions = {
  chapterId: 'ch04',
  title: 'Organisatorische context',
  questions: [
    { id: 'q1', chapterId: 'ch04', sectionRef: '4.1', difficulty: 'beginner', question: 'Q1', options: [], correctAnswerId: 'a', explanation: 'E', xpValue: 10 },
  ],
};

const mockBadges: BadgeCollection = {
  badges: [
    { id: 'b2', name: 'B2', description: 'd', icon: 'star', color: '#fff', sortOrder: 2, criteria: { trigger: 'first_quiz' } },
    { id: 'b1', name: 'B1', description: 'd', icon: 'star', color: '#fff', sortOrder: 1, criteria: { trigger: 'first_quiz' } },
  ],
};

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ContentService,
      ],
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // US-053 – getChapters returns array
  it('US-053: getChapters returns chapters array', async () => {
    const promise = firstValueFrom(service.getChapters());
    httpMock.expectOne('assets/data/index.json').flush(mockIndex);
    const chapters = await promise;
    expect(chapters.length).toBe(2);
    expect(chapters[0].id).toBe('ch04');
  });

  // US-053 – getChapter returns single chapter
  it('US-053: getChapter returns matching chapter', async () => {
    const promise = firstValueFrom(service.getChapter('ch04'));
    httpMock.expectOne('assets/data/index.json').flush(mockIndex);
    const ch = await promise;
    expect(ch?.id).toBe('ch04');
  });

  it('US-053: getChapter returns undefined for unknown id', async () => {
    const promise = firstValueFrom(service.getChapter('unknown'));
    httpMock.expectOne('assets/data/index.json').flush(mockIndex);
    const ch = await promise;
    expect(ch).toBeUndefined();
  });

  // US-053 – second call uses cache, no second HTTP request
  it('US-053: second getChapters call reuses cached observable', async () => {
    const p1 = firstValueFrom(service.getChapters());
    const p2 = firstValueFrom(service.getChapters());
    httpMock.expectOne('assets/data/index.json').flush(mockIndex);
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1.length).toBe(2);
    expect(r2.length).toBe(2);
  });

  // US-054 – getQuestions for regular chapter
  it('US-054: getQuestions fetches chapter-04.json for ch04', async () => {
    const promise = firstValueFrom(service.getQuestions('ch04'));
    httpMock.expectOne('assets/data/chapters/chapter-04.json').flush(mockQuestions);
    const qs = await promise;
    expect(qs.length).toBe(1);
  });

  // US-054 – getQuestions for annex-a
  it('US-054: getQuestions fetches annex-a.json for annex-a', async () => {
    const annexQuestions: ChapterQuestions = { ...mockQuestions, chapterId: 'annex-a' };
    const promise = firstValueFrom(service.getQuestions('annex-a'));
    httpMock.expectOne('assets/data/chapters/annex-a.json').flush(annexQuestions);
    const qs = await promise;
    expect(qs).toBeTruthy();
  });

  // US-054 – second call uses cache
  it('US-054: second getQuestions call does not make new HTTP request', async () => {
    const p1 = firstValueFrom(service.getQuestions('ch04'));
    httpMock.expectOne('assets/data/chapters/chapter-04.json').flush(mockQuestions);
    await p1;
    const p2 = firstValueFrom(service.getQuestions('ch04'));
    httpMock.expectNone('assets/data/chapters/chapter-04.json');
    await p2;
  });

  // US-055 – getAllBadges sorts by sortOrder
  it('US-055: getAllBadges returns badges sorted by sortOrder', async () => {
    const promise = firstValueFrom(service.getAllBadges());
    httpMock.expectOne('assets/data/badges.json').flush(mockBadges);
    const badges = await promise;
    expect(badges[0].id).toBe('b1');
    expect(badges[1].id).toBe('b2');
  });
});
