import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";
import type { ReviewStatus } from "@/lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reviewStatus = url.searchParams.get("reviewStatus") as ReviewStatus | null;
  const repo = await getRepository();
  return NextResponse.json(repo.getSources(reviewStatus ? { reviewStatus } : undefined));
}
