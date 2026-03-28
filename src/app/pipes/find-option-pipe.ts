import { Pipe, PipeTransform } from '@angular/core';
import { AnswerOption } from '../models/question.model';

@Pipe({ name: 'findOption' })
export class FindOptionPipe implements PipeTransform {
  transform(options: AnswerOption[], optionId: string): string {
    return options.find(o => o.id === optionId)?.text ?? '';
  }
}
