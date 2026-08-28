import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email FROM employees ORDER BY name"
    );
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}