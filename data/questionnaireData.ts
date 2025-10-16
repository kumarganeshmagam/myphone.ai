import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 'budget',
    type: 'select',
    label: 'What is your budget range?',
    required: true,
    options: [
      { value: 'under-300', label: 'Under $300' },
      { value: '300-600', label: '$300 - $600' },
      { value: '600-1000', label: '$600 - $1000' },
      { value: 'over-1000', label: 'Over $1000' },
    ],
  },
  {
    id: 'usage',
    type: 'options',
    label: 'What is your primary usage?',
    required: true,
    options: [
      { value: 'photography', label: 'Photography' },
      { value: 'gaming', label: 'Gaming' },
      { value: 'business', label: 'Business & Productivity' },
      { value: 'everyday', label: 'Everyday Use' },
    ],
  },
];
