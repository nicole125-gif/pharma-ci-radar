import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { approve: boolean };
  return NextResponse.json(getRepository().reviewScoreSuggestion(id, body.approve));
}
