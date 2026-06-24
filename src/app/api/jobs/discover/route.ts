import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";

export async function POST() {
  const repo = await getRepository();
  return NextResponse.json(repo.runDiscoveryJob());
}
