import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";
import type { ScoreSuggestionStatus } from "@/lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") as ScoreSuggestionStatus | null;
  const repo = await getRepository();
  return NextResponse.json(repo.getScoreSuggestions(status ? { status } : undefined));
}
