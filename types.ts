
export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: 'budget' | 'usage';
  type: 'select' | 'options';
  label: string;
  required: boolean;
  options: QuestionOption[];
}

export interface Answers {
  budget?: string;
  usage?: string;
}

export interface Recommendation {
  phoneName: string;
  reason: string;
  imageUrl: string;
}
