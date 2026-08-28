import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(`
      SELECT
        te.id,
        te.employee_id,
        e.name AS employee_name,
        te.entry_date,
        te.hours,
        te.created_at
      FROM timesheet_entries te
      JOIN employees e ON te.employee_id = e.id
      ORDER BY te.entry_date DESC
    `);
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
    const { employee_id, date, hours } = body;

    if (!employee_id || !date || !hours) {
      return NextResponse.json(
        { error: "Missing required fields: employee_id, date, hours" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO timesheet_entries (employee_id, entry_date, hours)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [employee_id, date, hours]
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