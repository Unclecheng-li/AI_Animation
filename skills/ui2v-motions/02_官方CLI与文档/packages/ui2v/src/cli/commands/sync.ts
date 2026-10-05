import { intro, outro } from "@clack/prompts";
import { hashSkillFiles, listMotionPackageFiles, readSkillOrigin } from "../../motions.js";
import { requireAuthToken } from "../authToken.js";
import { resolveClawdbotSkillRoots } from "../clawdbotConfig.js";
import { getFallbackSkillRoots } from "../scanMotions.js";
import type { GlobalOpts } from "../types.js";
import { createSpinner, fail, formatError, isInteractive } from "../ui.js";
import { cmdPublish } from "./publish.js";
import {
  buildScanRoots,
  checkRegistrySyncState,
  dedupeSkillsBySlug,
  formatActionableLine,
  formatBulletList,
  formatCommaList,
  formatList,
  formatSyncedDisplay,
  formatSyncedSummary,
  getRegistryWithAuth,
  mapWithConcurrency,
  mergeScan,
  normalizeConcurrency,
  printSection,
  reportTelemetryIfEnabled,
  resolvePublishMeta,
  scanRootsWithLabels,
  selectToUpload,
} from "./syncHelpers.js";
import type { Candidate, LocalSkill, SyncOptions } from "./syncTypes.js";

export async function cmdSync(opts: GlobalOpts, options: SyncOptions, inputAllowed: boolean) {
  const allowPrompt = isInteractive() && inputAllowed !== false;
  intro("UI2V sync");

  const token = await requireAuthToken();

  const registry = await getRegistryWithAuth(opts, token);
  const selectedRoots = buildScanRoots(opts, options.root);
  const clawdbotRoots = await resolveClawdbotSkillRoots();
  const combinedRoots = Array.from(
    new Set([...selectedRoots, ...clawdbotRoots.roots].map((root) => root.trim()).filter(Boolean)),
  );
  const concurrency = normalizeConcurrency(options.concurrency);

  const spinner = createSpinner("Scanning for local motions");
  const primaryScan = await scanRootsWithLabels(combinedRoots, clawdbotRoots.labels);
  let scan = primaryScan;
  let telemetryScan = primaryScan;
  if (primaryScan.motions.length === 0) {
    const fallback = getFallbackSkillRoots(opts.workdir);
    const fallbackScan = await scanRootsWithLabels(fallback);
    spinner.stop();
    telemetryScan = mergeScan(primaryScan, fallbackScan);
    scan = fallbackScan;
    if (fallbackScan.motions.length === 0)
      fail("No motions found (checked workdir and known compatibility locations)");
    printSection(
      `No motions in workdir. Found ${fallbackScan.motions.length} in fallback locations.`,
      formatList(fallbackScan.rootsWithSkills, 10),
    );
  } else {
    spinner.stop();
    const labeledRoots = primaryScan.rootsWithSkills
      .map((root) => {
        const label = primaryScan.rootLabels?.[root];
        return label ? `${label} (${root})` : root;
      })
      .filter(Boolean);
    if (labeledRoots.length > 0) {
      printSection("Roots with motions", formatList(labeledRoots, 10));
    }
  }
  const deduped = dedupeSkillsBySlug(scan.motions);
  const motions = deduped.motions;
  if (deduped.duplicates.length > 0) {
    printSection("Skipped duplicate slugs", formatCommaList(deduped.duplicates, 16));
  }
  const parsingSpinner = createSpinner("Parsing local motions");
  const locals: LocalSkill[] = [];
  try {
    let done = 0;
    const parsed = await mapWithConcurrency(motions, Math.min(concurrency, 12), async (skill) => {
      const filesOnDisk = await listMotionPackageFiles(skill.folder);
      const hashed = hashSkillFiles(filesOnDisk);
      const origin = await readSkillOrigin(skill.folder);
      done += 1;
      parsingSpinner.text = `Parsing local motions ${done}/${motions.length}`;
      return {
        ...skill,
        fingerprint: hashed.fingerprint,
        fileCount: filesOnDisk.length,
        origin,
      };
    });
    locals.push(...parsed);
  } catch (error) {
    parsingSpinner.fail(formatError(error));
    throw error;
  } finally {
    parsingSpinner.stop();
  }

  const candidatesSpinner = createSpinner("Checking registry sync state");
  const candidates: Candidate[] = [];
  const resolveSupport: { value: boolean | null } = { value: null };
  try {
    let done = 0;
    const resolved = await mapWithConcurrency(locals, Math.min(concurrency, 16), async (skill) => {
      try {
        return await checkRegistrySyncState(registry, skill, resolveSupport, token);
      } finally {
        done += 1;
        candidatesSpinner.text = `Checking registry sync state ${done}/${locals.length}`;
      }
    });
    candidates.push(...resolved);
  } catch (error) {
    candidatesSpinner.fail(formatError(error));
    throw error;
  } finally {
    candidatesSpinner.stop();
  }

  await reportTelemetryIfEnabled({
    token,
    registry,
    scan: telemetryScan,
    candidates,
  });

  const synced = candidates.filter((candidate) => candidate.status === "synced");
  const actionable = candidates.filter((candidate) => candidate.status !== "synced");
  const bump = options.bump ?? "patch";

  if (actionable.length === 0) {
    if (synced.length > 0) {
      printSection("Already synced", formatCommaList(synced.map(formatSyncedSummary), 16));
    }
    outro("Nothing to sync.");
    return;
  }

  printSection(
    "To sync",
    formatBulletList(
      actionable.map((candidate) => formatActionableLine(candidate, bump)),
      20,
    ),
  );
  if (synced.length > 0) {
    printSection("Already synced", formatSyncedDisplay(synced));
  }

  const selected = await selectToUpload(actionable, {
    allowPrompt,
    all: Boolean(options.all),
    bump,
  });
  if (selected.length === 0) {
    outro("Nothing selected.");
    return;
  }

  if (options.dryRun) {
    outro(`Dry run: would upload ${selected.length} motion(s).`);
    return;
  }

  const tags = options.tags ?? "latest";

  for (const skill of selected) {
    const { publishVersion, changelog } = await resolvePublishMeta(skill, {
      bump,
      allowPrompt,
      changelogFlag: options.changelog,
    });
    const forkOf =
      skill.origin && normalizeRegistry(skill.origin.registry) === normalizeRegistry(registry)
        ? skill.origin.slug !== skill.slug
          ? `${skill.origin.slug}@${skill.origin.installedVersion}`
          : undefined
        : undefined;
    await cmdPublish(opts, skill.folder, {
      slug: skill.slug,
      name: skill.displayName,
      version: publishVersion,
      changelog,
      tags,
      forkOf,
    });
  }

  outro(`Uploaded ${selected.length} motion(s).`);
}

function normalizeRegistry(value: string) {
  return value.trim().replace(/\/+$/, "").toLowerCase();
}
