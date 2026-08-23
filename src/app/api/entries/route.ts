import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM timesheet_entries ORDER BY entry_date DESC"
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { employee, date, hours } = body;

  const result = await pool.query(
    `INSERT INTO timesheet_entries (employee, entry_date, hours)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [employee, date, hours]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}