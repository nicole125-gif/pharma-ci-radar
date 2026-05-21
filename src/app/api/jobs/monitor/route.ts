import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json(await getRepository().runMonitorJob(body.sampleContent));
}
