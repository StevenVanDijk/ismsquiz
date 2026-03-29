import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionCard } from './question-card';
import { Question } from '../../models/question.model';

const mockQuestion: Question = {
  id: 'q1',
  chapterId: 'ch04',
  sectionRef: '4.1',
  difficulty: 'beginner',
  question: 'What is the answer?',
  options: [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
    { id: 'c', text: 'Option C' },
    { id: 'd', text: 'Option D' },
  ],
  correctAnswerId: 'b',
  explanation: 'Because B is correct.',
  xpValue: 10,
};

describe('QuestionCard', () => {
  let component: QuestionCard;
  let fixture: ComponentFixture<QuestionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionCard);
    component = fixture.componentInstance;
    component.question = mockQuestion;
    component.feedbackState = 'none';
    component.selectedAnswerId = null;
    fixture.detectChanges();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  // US-016 – question renders
  it('US-016: displays question text', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('What is the answer?');
  });

  it('US-016: displays four options', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.option-btn');
    expect(buttons.length).toBe(4);
  });

  it('US-016: displays section reference', () => {
    expect(fixture.nativeElement.textContent).toContain('4.1');
  });

  it('US-016: displays difficulty badge', () => {
    expect(fixture.nativeElement.textContent).toContain('beginner');
  });

  // US-018 – select emits event
  it('US-018: select emits answerSelected event', () => {
    let emitted: string | undefined;
    component.answerSelected.subscribe((id: string) => (emitted = id));
    component.select('a');
    expect(emitted).toBe('a');
  });

  it('US-018: select does nothing when feedbackState is not none', () => {
    let emitted: string | undefined;
    component.feedbackState = 'correct';
    component.answerSelected.subscribe((id: string) => (emitted = id));
    component.select('a');
    expect(emitted).toBeUndefined();
  });

  // US-019 – getOptionClass returns correct class
  it('US-019: getOptionClass returns empty when no feedback', () => {
    expect(component.getOptionClass('a')).toBe('');
  });

  it('US-019: getOptionClass returns correct for the correct answer after feedback', () => {
    component.feedbackState = 'correct';
    component.selectedAnswerId = 'b';
    expect(component.getOptionClass('b')).toBe('correct');
  });

  it('US-019: getOptionClass returns incorrect for wrong selected answer', () => {
    component.feedbackState = 'incorrect';
    component.selectedAnswerId = 'a';
    expect(component.getOptionClass('a')).toBe('incorrect');
  });

  it('US-019: getOptionClass returns correct for correct answer when wrong selected', () => {
    component.feedbackState = 'incorrect';
    component.selectedAnswerId = 'a';
    expect(component.getOptionClass('b')).toBe('correct');
  });

  it('US-019: getOptionClass returns dimmed for unselected wrong answer after feedback', () => {
    component.feedbackState = 'incorrect';
    component.selectedAnswerId = 'a';
    expect(component.getOptionClass('c')).toBe('dimmed');
  });

  // Explanation hidden before feedback
  it('US-019: explanation not shown before feedback', () => {
    const el: HTMLElement = fixture.nativeElement;
    const explanation = el.querySelector('.explanation');
    expect(explanation).toBeNull();
  });

  // Explanation shown after feedback
  it('US-019: explanation shown after answer', () => {
    fixture.componentRef.setInput('feedbackState', 'correct');
    fixture.componentRef.setInput('selectedAnswerId', 'b');
    fixture.detectChanges();
    const explanation = fixture.nativeElement.querySelector('.explanation');
    expect(explanation).not.toBeNull();
    expect(explanation.textContent).toContain('Because B is correct.');
  });
});
