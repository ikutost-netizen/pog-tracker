export type Member = {
  id: string;
  name: string;
  nickname: string;
  color: string;
  icon: string;
};

export type TitleEntry = {
  title: string;
  fromLabel: string;
};

export type MemberTitleHistory = {
  memberId: string;
  titleHistory: TitleEntry[];
};

export type MvpEntry = {
  horse: string;
  memberId: string;
  points: number;
  raceName?: string;
};

export type HistoryEntry = {
  date: string;
  label: string;
  screenshot: string | null;
  commentary: string;
  analysis?: string;
  mvp: MvpEntry | null;
  points: Record<string, number>;
};
