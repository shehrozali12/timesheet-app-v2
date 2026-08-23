export type TimesheetEntry = {
  id: number;
  employee: string;
  date: string;
  hours: number;
};

export const entries: TimesheetEntry[] = [
  { id: 1, employee: "Shari", date: "2026-07-28", hours: 8 },
  { id: 2, employee: "Ali", date: "2026-07-29", hours: 7.5 },
];