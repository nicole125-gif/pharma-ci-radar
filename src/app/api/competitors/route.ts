import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repository";

export async function GET() {
  return NextResponse.json(getRepository().getCompetitors());
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    differentiation?: string;
    officialUrl?: string;
  };

  try {
    const competitor = getRepository().createCompetitor({
      name: body.name ?? "",
      differentiation: body.differentiation ?? "",
      officialUrl: body.officialUrl
    });
    return NextResponse.json(competitor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create competitor" }, { status: 400 });
  }
}
