import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import { BadgeCard } from './badge-card';
import { Badge } from '../../models/badge.model';

const mockBadge: Badge = {
  id: 'test-badge',
  name: 'Test Badge',
  description: 'Earn this by testing',
  icon: 'star',
  color: '#FF5722',
  sortOrder: 1,
  criteria: { trigger: 'first_quiz' },
};

describe('BadgeCard', () => {
  let component: BadgeCard;
  let fixture: ComponentFixture<BadgeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeCard);
    component = fixture.componentInstance;
    component.badge = mockBadge;
  });

  it('creates component', () => {
    component.unlocked = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // US-049 – locked state
  it('US-049: locked badge has greyscale color variable', () => {
    component.unlocked = false;
    fixture.detectChanges();
    const card: HTMLElement = fixture.nativeElement.querySelector('.badge-card');
    expect(card.style.getPropertyValue('--badge-color')).toBe('#9E9E9E');
  });

  it('US-049: locked badge shows lock icon', () => {
    component.unlocked = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lock-icon')).not.toBeNull();
  });

  it('US-049: locked badge tooltip includes Vergrendeld', () => {
    component.unlocked = false;
    fixture.detectChanges();
    const tooltip = fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip);
    expect(tooltip.message).toContain('Vergrendeld');
  });

  // US-050 – unlocked state
  it('US-050: unlocked badge uses badge color', () => {
    component.unlocked = true;
    fixture.detectChanges();
    const card: HTMLElement = fixture.nativeElement.querySelector('.badge-card');
    expect(card.style.getPropertyValue('--badge-color')).toBe('#FF5722');
  });

  it('US-050: unlocked badge has no lock icon', () => {
    component.unlocked = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lock-icon')).toBeNull();
  });

  // US-051 – compact mode hides info
  it('US-051: compact mode hides badge name and description', () => {
    component.unlocked = true;
    component.compact = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.badge-info')).toBeNull();
  });

  it('US-051: non-compact mode shows badge name', () => {
    component.unlocked = true;
    component.compact = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.badge-name')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.badge-name').textContent).toContain('Test Badge');
  });

  // US-032 – badge description shown
  it('US-032: badge description shown when not compact', () => {
    component.unlocked = true;
    component.compact = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Earn this by testing');
  });

  // highlight input applies class
  it('highlight input adds highlight class', () => {
    component.unlocked = true;
    component.highlight = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.badge-card.highlight')).not.toBeNull();
  });
});
