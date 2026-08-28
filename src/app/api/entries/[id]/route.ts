import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const result = await pool.query(
      `SELECT
        te.id,
        te.employee_id,
        e.name AS employee_name,
        te.entry_date,
        te.hours,
        te.created_at
      FROM timesheet_entries te
      JOIN employees e ON te.employee_id = e.id
      WHERE te.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error("GET /api/entries/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { employee_id, date, hours } = body;

    if (!employee_id || !date || !hours) {
      return NextResponse.json(
        { error: "Missing required fields: employee_id, date, hours" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE timesheet_entries
       SET employee_id = $1, entry_date = $2, hours = $3
       WHERE id = $4
       RETURNING *`,
      [employee_id, date, hours, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error("PUT /api/entries/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const result = await pool.query(
      "DELETE FROM timesheet_entries WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: { message: "Entry deleted", entry: result.rows[0] },
    });
  } catch (error) {
    console.error("DELETE /api/entries/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}