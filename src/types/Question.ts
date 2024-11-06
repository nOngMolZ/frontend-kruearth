export interface Question {
  _id: string;
  subtopicId: string;
  questionName: string;
  option: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  hint: string;
  createOn?: string; // เปลี่ยนเป็น optional
}

export interface FormData {
  
  _id?: string;
  questionName: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: string;
  hint: string;
  }

export interface QuestionInput {
  _id?: string;
  questionName: string;
  option: { text: string; isCorrect: boolean }[];
  hint: string;
  subtopicId: string;
  createOn?: string;
}