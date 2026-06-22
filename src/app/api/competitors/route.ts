import { NextResponse } from "next/server";
import { getRepository, persistRepositoryState } from "@/lib/repository";

export async function GET() {
  const repo = await getRepository();
  return NextResponse.json(repo.getCompetitors());
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    differentiation?: string;
    officialUrl?: string;
  };

  try {
    const repo = await getRepository();
    const competitor = repo.createCompetitor({
      name: body.name ?? "",
      differentiation: body.differentiation ?? "",
      officialUrl: body.officialUrl
    });
    await persistRepositoryState(repo);
    return NextResponse.json(competitor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create competitor" }, { status: 400 });
  }
}
