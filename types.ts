
export interface QuestionOption {
  value: string;
  label: string;
}

export type QuestionType = 'select' | 'single' | 'multi' | 'number';

export interface Question {
  id: string; // generalized for all question ids
  type: QuestionType;
  label: string;
  required: boolean;
  options?: QuestionOption[]; // optional because number inputs don’t use options
  placeholder?: string;
  min?: number;
  max?: number;
}

// Answers can hold string, number, or string[] for multi-select
export interface Answers {
  [key: string]: string | number | string[];
}

export interface Recommendation {
  phoneName: string;
  reason: string;
  imageUrl: string;
  officialUrl?: string;
  productUrl?: string;
  storeName?: string;
}