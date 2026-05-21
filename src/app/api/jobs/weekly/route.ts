import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";

export async function POST() {
  return NextResponse.json(getRepository().createWeeklyBrief());
}
