import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-bar',
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  @Input() value = 0;
  @Input() label?: string;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() showLabel = true;
  @Input() height = 8;
}
