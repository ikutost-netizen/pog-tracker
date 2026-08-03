export type Member = {
  id: string;
  name: string;
  nickname: string;
  color: string;
  icon: string;
};

export type MvpEntry = {
  horse: string;
  memberId: string;
  points: number;
};

export type HistoryEntry = {
  date: string;
  label: string;
  screenshot: string | null;
  commentary: string;
  mvp: MvpEntry | null;
  points: Record<string, number>;
};
