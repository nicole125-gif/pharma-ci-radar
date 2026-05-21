import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";
import type { ScoreSuggestionStatus } from "@/lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") as ScoreSuggestionStatus | null;
  return NextResponse.json(getRepository().getScoreSuggestions(status ? { status } : undefined));
}
