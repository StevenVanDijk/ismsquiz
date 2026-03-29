import { FindOptionPipe } from './find-option-pipe';
import { AnswerOption } from '../models/question.model';

describe('FindOptionPipe', () => {
  let pipe: FindOptionPipe;

  const options: AnswerOption[] = [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
    { id: 'c', text: 'Option C' },
    { id: 'd', text: 'Option D' },
  ];

  beforeEach(() => {
    pipe = new FindOptionPipe();
  });

  // US-052 – valid ID returns text
  it('US-052: returns option text for valid id', () => {
    expect(pipe.transform(options, 'a')).toBe('Option A');
    expect(pipe.transform(options, 'c')).toBe('Option C');
  });

  // US-052 – invalid ID returns empty string
  it('US-052: returns empty string for unknown id', () => {
    expect(pipe.transform(options, 'z')).toBe('');
  });

  // US-052 – empty array returns empty string
  it('US-052: returns empty string for empty options array', () => {
    expect(pipe.transform([], 'a')).toBe('');
  });
});
