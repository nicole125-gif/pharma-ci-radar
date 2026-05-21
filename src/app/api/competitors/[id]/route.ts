import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = getRepository().getCompetitorDetail(id);

  if (!detail) {
    return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}
