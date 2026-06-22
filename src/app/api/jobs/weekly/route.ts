import { NextResponse } from "next/server";
import { getRepository, persistRepositoryState } from "@/lib/repository";

export async function POST() {
  const repo = await getRepository();
  const brief = repo.createWeeklyBrief();
  await persistRepositoryState(repo);
  return NextResponse.json(brief);
}
