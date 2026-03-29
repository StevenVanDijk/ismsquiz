import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { Shell } from './shell';
import { ProgressService } from '../../services/progress';
import { BadgeService } from '../../services/badge';
import { signal } from '@angular/core';
import { routes } from '../../app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProgressService,
        BadgeService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('creates the shell component', () => {
    expect(component).toBeTruthy();
  });

  // US-044 – bottom nav items
  it('US-044: renders three nav items', () => {
    expect(component.navItems.length).toBe(3);
    const labels = component.navItems.map(n => n.label);
    expect(labels).toContain('Home');
    expect(labels).toContain('Badges');
  });

  // US-045 – showBack is false on dashboard
  it('US-045: showBack is false on dashboard', async () => {
    await router.navigate(['/dashboard']);
    fixture.detectChanges();
    expect(component.showBack).toBe(false);
  });

  it('US-045: showBack is false on chapters list', async () => {
    await router.navigate(['/chapters']);
    fixture.detectChanges();
    expect(component.showBack).toBe(false);
  });

  it('US-045: showBack is true on chapter detail', async () => {
    await router.navigate(['/chapters', 'ch04']);
    fixture.detectChanges();
    expect(component.showBack).toBe(true);
  });

  it('US-045: showBack is false on badges', async () => {
    await router.navigate(['/badges']);
    fixture.detectChanges();
    expect(component.showBack).toBe(false);
  });

  // US-046 – page titles
  it('US-046: pageTitle is NEN 7510 Quiz on dashboard', async () => {
    await router.navigate(['/dashboard']);
    fixture.detectChanges();
    expect(component.pageTitle).toBe('NEN 7510 Quiz');
  });

  it('US-046: pageTitle is Hoofdstukken on chapter list', async () => {
    await router.navigate(['/chapters']);
    fixture.detectChanges();
    expect(component.pageTitle).toBe('Hoofdstukken');
  });

  it('US-046: pageTitle is Badges on badges page', async () => {
    await router.navigate(['/badges']);
    fixture.detectChanges();
    expect(component.pageTitle).toBe('Badges');
  });

  // US-047 – XP shown
  it('US-047: xp getter returns totalXP from progress service', () => {
    expect(component.xp).toBe(0);
  });

  // US-044 – isActive
  it('US-044: isActive returns true for matching route prefix', async () => {
    await router.navigate(['/dashboard']);
    fixture.detectChanges();
    expect(component.isActive('/dashboard')).toBe(true);
    expect(component.isActive('/chapters')).toBe(false);
  });
});
