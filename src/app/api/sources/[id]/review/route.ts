import { NextResponse } from "next/server";
import { getRepository, persistRepositoryState } from "@/lib/repository";
import type { ReviewStatus } from "@/lib/types";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { reviewStatus: ReviewStatus };
  const repo = await getRepository();
  const source = repo.reviewSource(id, body.reviewStatus);
  await persistRepositoryState(repo);
  return NextResponse.json(source);
}
