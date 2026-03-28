import { Component, inject, computed } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgressService } from '../../services/progress';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterModule, MatToolbarModule, MatIconModule, MatButtonModule, MatBadgeModule],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  router = inject(Router);
  progressService = inject(ProgressService);

  navItems: NavItem[] = [
    { label: 'Home', icon: 'home', route: '/dashboard' },
    { label: 'Hoofdstukken', icon: 'menu_book', route: '/chapters' },
    { label: 'Badges', icon: 'emoji_events', route: '/badges' },
  ];

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  isActive(route: string): boolean {
    return this.currentUrl()?.startsWith(route) ?? false;
  }

  get pageTitle(): string {
    const url = this.currentUrl() ?? '';
    if (url.startsWith('/dashboard')) return 'NEN 7510 Quiz';
    if (url.startsWith('/chapters/') && !url.includes('/quiz/')) return 'Hoofdstuk';
    if (url.startsWith('/chapters')) return 'Hoofdstukken';
    if (url.startsWith('/quiz')) return 'Quiz';
    if (url.startsWith('/results')) return 'Resultaten';
    if (url.startsWith('/badges')) return 'Badges';
    return 'NEN 7510 Quiz';
  }

  get showBack(): boolean {
    const url = this.currentUrl() ?? '';
    return url.startsWith('/chapters/') || url.startsWith('/quiz/') || url.startsWith('/results/');
  }

  goBack(): void {
    const url = this.currentUrl() ?? '';
    if (url.startsWith('/quiz/')) {
      const chapterId = url.split('/')[2];
      this.router.navigate(['/chapters', chapterId]);
    } else if (url.startsWith('/results/')) {
      this.router.navigate(['/chapters']);
    } else {
      this.router.navigate(['/chapters']);
    }
  }

  get xp(): number {
    return this.progressService.totalXP();
  }
}
