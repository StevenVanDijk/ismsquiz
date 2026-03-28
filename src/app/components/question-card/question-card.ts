import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Question } from '../../models/question.model';

export type FeedbackState = 'none' | 'correct' | 'incorrect';

@Component({
  selector: 'app-question-card',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './question-card.html',
  styleUrl: './question-card.scss',
})
export class QuestionCard {
  @Input() question!: Question;
  @Input() feedbackState: FeedbackState = 'none';
  @Input() selectedAnswerId: string | null = null;
  @Output() answerSelected = new EventEmitter<string>();

  select(optionId: string): void {
    if (this.feedbackState !== 'none') return;
    this.answerSelected.emit(optionId);
  }

  getOptionClass(optionId: string): string {
    if (this.feedbackState === 'none') return '';
    if (optionId === this.question.correctAnswerId) return 'correct';
    if (optionId === this.selectedAnswerId && this.feedbackState === 'incorrect') return 'incorrect';
    return 'dimmed';
  }
}
