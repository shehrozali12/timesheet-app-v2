import { NextResponse } from "next/server";

type TimesheetEntry = {
  id: number;
  employee: string;
  date: string;
  hours: number;
};

// In-memory data store (resets on server restart — temporary, for learning)
let entries: TimesheetEntry[] = [
  { id: 1, employee: "Shari", date: "2026-07-28", hours: 8 },
  { id: 2, employee: "Ali", date: "2026-07-29", hours: 7.5 },
];

export async function GET() {
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newEntry: TimesheetEntry = {
    id: entries.length + 1,
    employee: body.employee,
    date: body.date,
    hours: body.hours,
  };

  entries.push(newEntry);

  return NextResponse.json(newEntry, { status: 201 });
}