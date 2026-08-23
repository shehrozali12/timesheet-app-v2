import { NextResponse } from "next/server";
import { entries } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entry = entries.find((e) => e.id === Number(id));

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = entries.findIndex((e) => e.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  entries.splice(index, 1);

  return NextResponse.json({ message: "Entry deleted" });
}