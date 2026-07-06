export type Member = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type HistoryEntry = {
  date: string;
  label: string;
  screenshot: string | null;
  commentary: string;
  points: Record<string, number>;
};
