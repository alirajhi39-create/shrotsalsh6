import type { AnswerMap } from "../types";

export type StationProps = {
  answers: AnswerMap;
  save: (key: string, value: unknown) => void;
  complete: () => void;
  studentName: string;
  className: string;
};

export type ChoiceState = Record<string, number | boolean | string>;
