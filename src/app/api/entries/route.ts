import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM timesheet_entries ORDER BY entry_date DESC"
    );
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("GET /api/entries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { employee, date, hours } = body;

    if (!employee || !date || !hours) {
      return NextResponse.json(
        { error: "Missing required fields: employee, date, hours" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO timesheet_entries (employee, entry_date, hours)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [employee, date, hours]
    );

    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/entries error:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}