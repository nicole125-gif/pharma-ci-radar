import { NextResponse } from "next/server";
import { getRepository, persistRepositoryState } from "@/lib/repository";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { approve: boolean };
  const repo = await getRepository();
  const suggestion = repo.reviewScoreSuggestion(id, body.approve);
  await persistRepositoryState(repo);
  return NextResponse.json(suggestion);
}
