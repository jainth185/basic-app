// types/quizTypes.ts
export interface QuizQuestion {
    _uid: string;
    id: number;
    question: string;
    answers: string[];
    correctAnswerIndex: number;
  }
  