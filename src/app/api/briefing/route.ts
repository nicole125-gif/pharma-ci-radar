import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";

export function GET() {
  return NextResponse.json(getRepository().getStrategicBrief());
}
