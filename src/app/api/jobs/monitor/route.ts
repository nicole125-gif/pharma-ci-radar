import { NextResponse } from "next/server";
import { getRepository, persistRepositoryState } from "@/lib/repository";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const repo = await getRepository();
  const result = await repo.runMonitorJob(body.sampleContent);
  await persistRepositoryState(repo);
  return NextResponse.json(result);
}
