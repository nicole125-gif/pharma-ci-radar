import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";
import type { ReviewStatus } from "@/lib/types";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { reviewStatus: ReviewStatus };
  return NextResponse.json(getRepository().reviewSource(id, body.reviewStatus));
}
