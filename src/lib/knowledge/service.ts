import { loadKnowledgeCatalog } from "./catalog";
import { getKnowledgeStore } from "./postgres-store";
import {
  assertInternalEvidenceInput,
  assertTrainingLearnerInput,
  assertTrainingProgressInput,
  assertTrainingScoreInput,
  assertValidationTaskStateInput,
  assertValidationTransition,
  assessTrainingScore
} from "./rules";
import { buildKnowledgeSummary } from "./search";
import { buildEvidenceHealthSummary } from "./evidence-health";
import type { KnowledgeExecutionStore, KnowledgeStore } from "./store";
import type {
  InternalEvidenceInput,
  TrainingLearnerInput,
  TrainingProgressInput,
  TrainingScoreInput,
  ValidationTaskState,
  ValidationTaskStateInput
} from "./types";

interface StoreOption {
  store?: KnowledgeStore;
}

async function resolveStore(store?: KnowledgeStore) {
  return store ?? (await getKnowledgeStore());
}

function requireAvailableStore(
  store: KnowledgeStore
): KnowledgeExecutionStore {
  if (!store.available) {
    throw new Error(store.reason);
  }
  return store;
}

export async function buildKnowledgeWorkspace(options?: {
  store?: KnowledgeStore;
  learnerId?: string;
}) {
  const catalog = await loadKnowledgeCatalog();
  const store = await resolveStore(options?.store);
  const summary = buildKnowledgeSummary(catalog);
  const evidenceHealth = buildEvidenceHealthSummary(
    catalog.evidenceRecords,
    catalog.validationTasks
  );

  if (!store.available) {
    return {
      catalog,
      summary,
      evidenceHealth,
      database: store,
      training: {
        learners: [],
        selectedLearner: undefined,
        progress: [],
        scores: []
      },
      validation: {
        tasks: catalog.validationTasks.map((definition) => ({
          definition,
          state: {
            validationId: definition.validationId,
            status: definition.defaultStatus
          } as ValidationTaskState,
          verifiedEvidenceCount: 0,
          totalEvidenceCount: 0
        })),
        evidence: []
      }
    };
  }

  const [learners, validationStates, evidence] = await Promise.all([
    store.listLearners(),
    store.listValidationStates(),
    store.listEvidence()
  ]);
  const selectedLearner =
    learners.find((learner) => learner.id === options?.learnerId) ??
    learners[0];
  const [progress, scores] = selectedLearner
    ? await Promise.all([
        store.listProgress(selectedLearner.id),
        store.listScores(selectedLearner.id)
      ])
    : [[], []];
  const stateById = new Map(
    validationStates.map((state) => [state.validationId, state])
  );

  return {
    catalog,
    summary,
    evidenceHealth,
    database: store,
    training: { learners, selectedLearner, progress, scores },
    validation: {
      tasks: catalog.validationTasks.map((definition) => {
        const taskEvidence = evidence.filter(
          (item) => item.validationId === definition.validationId
        );
        return {
          definition,
          state:
            stateById.get(definition.validationId) ??
            ({
              validationId: definition.validationId,
              status: definition.defaultStatus
            } as ValidationTaskState),
          verifiedEvidenceCount: taskEvidence.filter(
            (item) => item.verificationStatus === "VERIFIED"
          ).length,
          totalEvidenceCount: taskEvidence.length
        };
      }),
      evidence
    }
  };
}

export async function createTrainingLearner(
  input: TrainingLearnerInput,
  options: StoreOption = {}
) {
  const store = requireAvailableStore(await resolveStore(options.store));
  return store.createLearner(assertTrainingLearnerInput(input));
}

export async function saveTrainingProgress(
  input: TrainingProgressInput,
  options: StoreOption = {}
) {
  const catalog = await loadKnowledgeCatalog();
  const store = requireAvailableStore(await resolveStore(options.store));
  const parsed = assertTrainingProgressInput(input);
  const [learners] = await Promise.all([store.listLearners()]);
  if (!learners.some((learner) => learner.id === parsed.learnerId)) {
    throw new Error(`Unknown learner: ${parsed.learnerId}`);
  }
  if (!catalog.curriculum.some((day) => day.day === parsed.day)) {
    throw new Error(`Unknown curriculum day: ${parsed.day}`);
  }
  return store.upsertProgress(parsed);
}

export async function recordTrainingScore(
  input: TrainingScoreInput,
  options: StoreOption = {}
) {
  const store = requireAvailableStore(await resolveStore(options.store));
  const learners = await store.listLearners();
  if (!learners.some((learner) => learner.id === input.learnerId)) {
    throw new Error(`Unknown learner: ${input.learnerId}`);
  }
  const assessment = assessTrainingScore(input);
  return store.createScore(
    assertTrainingScoreInput({ ...input, ...assessment })
  );
}

export async function saveValidationTaskState(
  input: ValidationTaskStateInput,
  options: StoreOption & { acceptanceConfirmed?: boolean } = {}
) {
  const catalog = await loadKnowledgeCatalog();
  const store = requireAvailableStore(await resolveStore(options.store));
  const parsed = assertValidationTaskStateInput(input);
  const definition = catalog.validationTasks.find(
    (task) => task.validationId === parsed.validationId
  );
  if (!definition) {
    throw new Error(`Unknown validation task: ${parsed.validationId}`);
  }
  const evidence = await store.listEvidence(parsed.validationId);
  assertValidationTransition({
    requestedStatus: parsed.status,
    verifiedEvidenceCount: evidence.filter(
      (item) => item.verificationStatus === "VERIFIED"
    ).length,
    minimumVerifiedRecords: definition.minimumVerifiedRecords,
    conclusion: parsed.conclusion,
    acceptanceConfirmed: options.acceptanceConfirmed ?? false
  });
  return store.upsertValidationState(parsed);
}

export async function registerInternalEvidence(
  input: InternalEvidenceInput,
  options: StoreOption = {}
) {
  const catalog = await loadKnowledgeCatalog();
  const store = requireAvailableStore(await resolveStore(options.store));
  const parsed = assertInternalEvidenceInput(input);
  if (
    !catalog.validationTasks.some(
      (task) => task.validationId === parsed.validationId
    )
  ) {
    throw new Error(`Unknown validation task: ${parsed.validationId}`);
  }
  return store.createEvidence(parsed);
}
