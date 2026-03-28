import { Routes } from '@angular/router';
import { Shell } from './components/shell/shell';
import { Dashboard } from './components/dashboard/dashboard';
import { ChapterList } from './components/chapter-list/chapter-list';
import { ChapterDetail } from './components/chapter-detail/chapter-detail';
import { Quiz } from './components/quiz/quiz';
import { Results } from './components/results/results';
import { BadgeCollection } from './components/badge-collection/badge-collection';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'chapters', component: ChapterList },
      { path: 'chapters/:id', component: ChapterDetail },
      { path: 'quiz/:chapterId', component: Quiz },
      { path: 'results/:chapterId', component: Results },
      { path: 'badges', component: BadgeCollection },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
