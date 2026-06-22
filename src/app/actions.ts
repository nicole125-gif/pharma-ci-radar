"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRepository, persistRepositoryState } from "@/lib/repository";
import type { ImpactLevel, ReviewStatus, SalesIntelReliability, SalesIntelSignalType, SalesIntelStatus } from "@/lib/types";

export async function reviewSourceAction(formData: FormData) {
  const sourceId = String(formData.get("sourceId"));
  const reviewStatus = String(formData.get("reviewStatus")) as ReviewStatus;
  const repo = await getRepository();
  repo.reviewSource(sourceId, reviewStatus);
  await persistRepositoryState(repo);
  revalidatePath("/sources");
  revalidatePath("/");
}

export async function runMonitorAction() {
  const repo = await getRepository();
  const result = await repo.runMonitorJob();
  await persistRepositoryState(repo);
  revalidatePath("/");
  revalidatePath("/alerts");
  revalidatePath("/score-suggestions");
  redirect(`/?monitor=done&scanned=${result.scannedSources}&events=${result.createdEvents}`);
}

export async function reviewScoreSuggestionAction(formData: FormData) {
  const suggestionId = String(formData.get("suggestionId"));
  const approve = String(formData.get("approve")) === "true";
  const repo = await getRepository();
  repo.reviewScoreSuggestion(suggestionId, approve);
  await persistRepositoryState(repo);
  revalidatePath("/");
  revalidatePath("/matrix");
  revalidatePath("/score-suggestions");
}

export async function createWeeklyBriefAction() {
  const repo = await getRepository();
  repo.createWeeklyBrief();
  await persistRepositoryState(repo);
  revalidatePath("/");
}

export async function createCompetitorAction(formData: FormData) {
  const repo = await getRepository();
  const competitor = repo.createCompetitor({
    name: String(formData.get("name") ?? ""),
    differentiation: String(formData.get("differentiation") ?? ""),
    officialUrl: String(formData.get("officialUrl") ?? "")
  });
  await persistRepositoryState(repo);

  revalidatePath("/");
  revalidatePath("/competitors");
  revalidatePath("/matrix");
  revalidatePath("/sources");
  redirect(`/competitors/${competitor.id}`);
}

export async function goToCompetitorAction(formData: FormData) {
  const competitorId = String(formData.get("competitorId"));
  redirect(`/competitors/${competitorId}`);
}

export async function createSalesIntelAction(formData: FormData) {
  const repo = await getRepository();
  repo.createSalesIntel({
    competitorId: String(formData.get("competitorId") ?? ""),
    accountContext: String(formData.get("accountContext") ?? ""),
    region: String(formData.get("region") ?? ""),
    submittedBy: String(formData.get("submittedBy") ?? ""),
    signalType: String(formData.get("signalType") ?? "OTHER") as SalesIntelSignalType,
    reliability: String(formData.get("reliability") ?? "MEDIUM") as SalesIntelReliability,
    impactLevel: String(formData.get("impactLevel") ?? "MEDIUM") as ImpactLevel,
    summary: String(formData.get("summary") ?? ""),
    sensitive: String(formData.get("sensitive") ?? "") === "on"
  });
  await persistRepositoryState(repo);

  revalidatePath("/sales-intel");
}

export async function reviewSalesIntelAction(formData: FormData) {
  const repo = await getRepository();
  repo.reviewSalesIntel(String(formData.get("intelId")), String(formData.get("status")) as SalesIntelStatus);
  await persistRepositoryState(repo);
  revalidatePath("/sales-intel");
  revalidatePath("/");
  revalidatePath("/analysis");
  revalidatePath("/battlecards");
}
