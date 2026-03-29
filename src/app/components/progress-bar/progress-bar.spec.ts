import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  let component: ProgressBar;
  let fixture: ComponentFixture<ProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBar],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBar);
    component = fixture.componentInstance;
  });

  it('creates component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // US-048 – default value is 0
  it('US-048: default value is 0', () => {
    fixture.detectChanges();
    expect(component.value).toBe(0);
  });

  // US-048 – label shown when showLabel true and label provided
  it('US-048: label shown when showLabel is true and label provided', () => {
    component.label = 'Voortgang';
    component.showLabel = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Voortgang');
  });

  // US-048 – percentage shown alongside label
  it('US-048: percentage shown alongside label', () => {
    component.label = 'Progress';
    component.value = 75;
    component.showLabel = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('75%');
  });

  // US-048 – label hidden when showLabel false
  it('US-048: label hidden when showLabel is false', () => {
    component.label = 'Hidden';
    component.showLabel = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.progress-label')).toBeNull();
  });

  // US-048 – height applied
  it('US-048: height input applied to progress bar element', () => {
    component.height = 12;
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(bar.style.height).toBe('12px');
  });

  // US-048 – label hidden when no label text provided
  it('US-048: label row hidden when label is undefined', () => {
    component.showLabel = true;
    component.label = undefined;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.progress-label')).toBeNull();
  });

  // value binding
  it('passes value to mat-progress-bar', () => {
    component.value = 42;
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(bar).not.toBeNull();
  });
});
