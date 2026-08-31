export type ScheduleHorse = {
  horse: string;
  memberId: string;
  jockey?: string;
};

export type ScheduleEntry = {
  date: string;
  venue: string;
  distance: string;
  raceName: string;
  horses: ScheduleHorse[];
  consideration: string[];
  comment?: string;
  classicRoadmapId?: string | null;
};

export type WeekSchedule = {
  weekLabel: string;
  dateRange: string;
  entries: ScheduleEntry[];
};

export type ConsiderationHorse = {
  horse: string;
  memberId: string;
  note: string;
  status?: string;
};

export type WithdrawnHorse = {
  horse: string;
  memberId: string;
  reason: string;
};

export type ScheduleData = {
  nextWeek: WeekSchedule | null;
  upcoming: WeekSchedule[];
  consideration: ConsiderationHorse[];
  withdrawn: WithdrawnHorse[];
};

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
