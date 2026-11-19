export type AnswerMap = Record<string, unknown>;

export type StudentProgress = {
  studentName: string;
  className: string;
  started: boolean;
  currentStation: number;
  completed: number[];
  answers: AnswerMap;
  createdAt: string;
  lastVisited: string;
};

export const emptyProgress: StudentProgress = {
  studentName: "",
  className: "٣/١",
  started: false,
  currentStation: 1,
  completed: [],
  answers: {},
  createdAt: "",
  lastVisited: "",
};
