#!/usr/bin/env node
import { stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Command } from "commander";
import { getCliBuildLabel, getCliVersion } from "./cli/buildInfo.js";
import { resolveClawdbotDefaultWorkspace } from "./cli/clawdbotConfig.js";
import { cmdLoginFlow, cmdLogout, cmdWhoami } from "./cli/commands/auth.js";
import {
  cmdDeleteSkill,
  cmdHideSkill,
  cmdUndeleteSkill,
  cmdUnhideSkill,
} from "./cli/commands/delete.js";
import { cmdInspect } from "./cli/commands/inspect.js";
import { cmdBanUser, cmdSetRole } from "./cli/commands/moderation.js";
import { cmdMergeSkill, cmdRenameSkill } from "./cli/commands/ownership.js";
import {
  cmdExplorePackages,
  cmdGetPackageTrustedPublisher,
  cmdInspectPackage,
  cmdDeletePackageTrustedPublisher,
  cmdPublishPackage,
  cmdSetPackageTrustedPublisher,
} from "./cli/commands/packages.js";
import { cmdPublish } from "./cli/commands/publish.js";
import {
  cmdExplore,
  cmdInstall,
  cmdList,
  cmdSearch,
  cmdUninstall,
  cmdUpdate,
} from "./cli/commands/motions.js";
import { cmdStarSkill } from "./cli/commands/star.js";
import { cmdSync } from "./cli/commands/sync.js";
import {
  cmdTransferAccept,
  cmdTransferCancel,
  cmdTransferList,
  cmdTransferReject,
  cmdTransferRequest,
} from "./cli/commands/transfer.js";
import { cmdUnstarSkill } from "./cli/commands/unstar.js";
import { cmdUpgrade } from "./cli/commands/upgrade.js";
import { configureCommanderHelp, styleEnvBlock, styleTitle } from "./cli/helpStyle.js";
import { warnIfCliBelowMin } from "./cli/minCliWarn.js";
import { DEFAULT_REGISTRY, DEFAULT_SITE } from "./cli/registry.js";
import type { GlobalOpts } from "./cli/types.js";
import { fail } from "./cli/ui.js";
import { readGlobalConfig } from "./config.js";

const program = new Command()
  .name("ui2v")
  .description(
    `${styleTitle(`UI2V CLI ${getCliBuildLabel()}`)}\n${styleEnvBlock(
      "search, install, publish, and sync HyperFrames motions and compatible packages.",
    )}`,
  )
  .version(getCliVersion(), "-V, --cli-version", "Show CLI version")
  .option("--workdir <dir>", "Working directory (default: cwd)")
  .option("--dir <dir>", "Motions directory (relative to workdir, default: motions)")
  .option("--site <url>", "Site base URL (for browser login)")
  .option("--registry <url>", "Registry API base URL")
  .option("--no-input", "Disable prompts")
  .showHelpAfterError()
  .showSuggestionAfterError()
  .addHelpText(
    "after",
    styleEnvBlock(
      "\nEnv:\n  UI2V_SITE\n  UI2V_REGISTRY\n  UI2V_WORKDIR\n  (CLAWHUB_*/CLAWDHUB_* legacy)\n",
    ),
  );

configureCommanderHelp(program);

async function resolveGlobalOpts(): Promise<GlobalOpts> {
  const raw = program.opts<{ workdir?: string; dir?: string; site?: string; registry?: string }>();
  const workdir = await resolveWorkdir(raw.workdir);
  const dir = resolve(workdir, raw.dir ?? "motions");
  const site =
    raw.site ??
    process.env.UI2V_SITE ??
    process.env.CLAWHUB_SITE ??
    process.env.CLAWDHUB_SITE ??
    DEFAULT_SITE;
  const registrySource = raw.registry
    ? "cli"
    : process.env.UI2V_REGISTRY || process.env.CLAWHUB_REGISTRY || process.env.CLAWDHUB_REGISTRY
      ? "env"
      : "default";
  const registry =
    raw.registry ??
    process.env.UI2V_REGISTRY ??
    process.env.CLAWHUB_REGISTRY ??
    process.env.CLAWDHUB_REGISTRY ??
    DEFAULT_REGISTRY;
  return { workdir, dir, site, registry, registrySource };
}

/** Resolve opts and soft-warn when below site minCliVersion (network commands). */
async function resolveNetworkOpts(): Promise<GlobalOpts> {
  const opts = await resolveGlobalOpts();
  await warnIfCliBelowMin(opts);
  return opts;
}

function isInputAllowed() {
  const globalFlags = program.opts<{ input?: boolean }>();
  return globalFlags.input !== false;
}

async function resolveWorkdir(explicit?: string) {
  if (explicit?.trim()) return resolve(explicit.trim());
  const envWorkdir =
    process.env.UI2V_WORKDIR?.trim() ??
    process.env.CLAWHUB_WORKDIR?.trim() ??
    process.env.CLAWDHUB_WORKDIR?.trim();
  if (envWorkdir) return resolve(envWorkdir);

  const cwd = resolve(process.cwd());
  const hasMarker = await hasUi2vMarker(cwd);
  if (hasMarker) return cwd;

  const clawdbotWorkspace = await resolveClawdbotDefaultWorkspace();
  return clawdbotWorkspace ? resolve(clawdbotWorkspace) : cwd;
}

async function hasUi2vMarker(workdir: string) {
  for (const dir of [".ui2v", ".clawhub", ".clawdhub"]) {
    const lockfile = join(workdir, dir, "lock.json");
    if (await pathExists(lockfile)) return true;
    const markerDir = join(workdir, dir);
    if (await pathExists(markerDir)) return true;
  }
  return false;
}

async function pathExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

program
  .command("login")
  .description("Log in (opens browser or stores token)")
  .option("--token <token>", "API token")
  .option("--label <label>", "Token label (browser flow only)", "CLI token")
  .option("--no-browser", "Do not open browser (requires --token)")
  .action(async (options) => {
    const opts = await resolveNetworkOpts();
    await cmdLoginFlow(opts, options, isInputAllowed());
  });

program
  .command("logout")
  .description("Remove stored token")
  .action(async () => {
    const opts = await resolveGlobalOpts();
    await cmdLogout(opts);
  });

program
  .command("whoami")
  .description("Validate token")
  .action(async () => {
    const opts = await resolveNetworkOpts();
    await cmdWhoami(opts);
  });

const auth = program
  .command("auth")
  .description("Authentication commands")
  .showHelpAfterError()
  .showSuggestionAfterError();

auth
  .command("login")
  .description("Log in (opens browser or stores token)")
  .option("--token <token>", "API token")
  .option("--label <label>", "Token label (browser flow only)", "CLI token")
  .option("--no-browser", "Do not open browser (requires --token)")
  .action(async (options) => {
    const opts = await resolveNetworkOpts();
    await cmdLoginFlow(opts, options, isInputAllowed());
  });

auth
  .command("logout")
  .description("Remove stored token")
  .action(async () => {
    const opts = await resolveGlobalOpts();
    await cmdLogout(opts);
  });

auth
  .command("whoami")
  .description("Validate token")
  .action(async () => {
    const opts = await resolveNetworkOpts();
    await cmdWhoami(opts);
  });

program
  .command("search")
  .description("Vector search motions")
  .argument("<query...>", "Query string")
  .option("--limit <n>", "Max results", (value) => Number.parseInt(value, 10))
  .action(async (queryParts, options) => {
    const opts = await resolveNetworkOpts();
    const query = queryParts.join(" ").trim();
    await cmdSearch(opts, query, options.limit);
  });

program
  .command("install")
  .description("Install into <dir>/<slug>")
  .argument("<slug>", "Motion slug")
  .option("--version <version>", "Version to install")
  .option("--force", "Overwrite existing folder")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdInstall(opts, slug, options.version, options.force);
  });

program
  .command("update")
  .description("Update installed motions")
  .argument("[slug]", "Motion slug")
  .option("--all", "Update all installed motions")
  .option("--version <version>", "Update to specific version (single slug only)")
  .option("--force", "Overwrite when local files do not match any version")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdUpdate(opts, slug, options, isInputAllowed());
  });

program
  .command("uninstall")
  .description("Uninstall a motion")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdUninstall(opts, slug, options, isInputAllowed());
  });

program
  .command("list")
  .description("List installed motions (from lockfile)")
  .action(async () => {
    const opts = await resolveGlobalOpts();
    await cmdList(opts);
  });

program
  .command("explore")
  .description("Browse latest updated motions from the registry")
  .option(
    "--limit <n>",
    "Number of motions to show (max 200)",
    (value) => Number.parseInt(value, 10),
    25,
  )
  .option(
    "--sort <order>",
    "Sort by newest, downloads, rating, installs, installsAllTime, or trending",
    "newest",
  )
  .option("--json", "Output JSON")
  .action(async (options) => {
    const opts = await resolveNetworkOpts();
    const limit =
      typeof options.limit === "number" && Number.isFinite(options.limit) ? options.limit : 25;
    await cmdExplore(opts, { limit, sort: options.sort, json: options.json });
  });

program
  .command("inspect")
  .description("Fetch motion metadata and files without installing")
  .argument("<slug>", "Motion slug")
  .option("--version <version>", "Version to inspect")
  .option("--tag <tag>", "Tag to inspect (default: latest)")
  .option("--versions", "List version history (first page)")
  .option("--limit <n>", "Max versions to list (1-200)", (value) => Number.parseInt(value, 10))
  .option("--files", "List files for the selected version")
  .option("--file <path>", "Fetch raw file content (text <= 200KB)")
  .option("--json", "Output JSON")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdInspect(opts, slug, options);
  });

program
  .command("publish")
  .description("Legacy alias: publish a motion from folder")
  .argument("<path>", "Motion folder path")
  .option("--slug <slug>", "Motion slug")
  .option("--name <name>", "Display name")
  .option("--version <version>", "Version (semver)")
  .option("--fork-of <slug[@version]>", "Mark as a fork of an existing motion")
  .option("--changelog <text>", "Changelog text")
  .option("--tags <tags>", "Comma-separated tags", "latest")
  .action(async (folder, options) => {
    const opts = await resolveNetworkOpts();
    await cmdPublish(opts, folder, options);
  });

program
  .command("delete")
  .description("Soft-delete a motion (owner, moderator, or admin)")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdDeleteSkill(opts, slug, options, isInputAllowed());
  });

program
  .command("hide")
  .description("Hide a motion (owner, moderator, or admin)")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdHideSkill(opts, slug, options, isInputAllowed());
  });

program
  .command("undelete")
  .description("Restore a hidden motion (owner, moderator, or admin)")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdUndeleteSkill(opts, slug, options, isInputAllowed());
  });

program
  .command("unhide")
  .description("Unhide a motion (owner, moderator, or admin)")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdUnhideSkill(opts, slug, options, isInputAllowed());
  });

const motion = program
  .command("motion")
  .alias("skill")
  .description("Manage published motions");
motion
  .command("publish")
  .description("Publish a motion from folder")
  .argument("<path>", "Motion folder path")
  .option("--slug <slug>", "Motion slug")
  .option("--name <name>", "Display name")
  .option("--version <version>", "Version (semver)")
  .option("--fork-of <slug[@version]>", "Mark as a fork of an existing motion")
  .option("--changelog <text>", "Changelog text")
  .option("--tags <tags>", "Comma-separated tags", "latest")
  .action(async (folder, options) => {
    const opts = await resolveNetworkOpts();
    await cmdPublish(opts, folder, options);
  });

const packageCmd = program
  .command("package")
  .description("Browse and publish compatible registry packages");

packageCmd
  .command("explore")
  .description("Browse published packages and plugins")
  .argument("[query...]", "Optional search query")
  .option("--family <family>", "motion|skill|code-plugin|bundle-plugin")
  .option("--official", "Only official packages")
  .option("--executes-code", "Only packages that execute code")
  .option(
    "--limit <n>",
    "Number of packages to show (max 100)",
    (value) => Number.parseInt(value, 10),
    25,
  )
  .option("--json", "Output JSON")
  .action(async (queryParts, options) => {
    const opts = await resolveNetworkOpts();
    const query = Array.isArray(queryParts) ? queryParts.join(" ").trim() : "";
    await cmdExplorePackages(opts, query, options);
  });

packageCmd
  .command("inspect")
  .description("Fetch package metadata and files without installing")
  .argument("<name>", "Package name")
  .option("--version <version>", "Version to inspect")
  .option("--tag <tag>", "Tag to inspect (default: latest)")
  .option("--versions", "List version history (first page)")
  .option("--limit <n>", "Max versions to list (1-100)", (value) => Number.parseInt(value, 10))
  .option("--files", "List files for the selected version")
  .option("--file <path>", "Fetch raw file content (text only)")
  .option("--json", "Output JSON")
  .action(async (name, options) => {
    const opts = await resolveNetworkOpts();
    await cmdInspectPackage(opts, name, options);
  });

packageCmd
  .command("publish")
  .description("Publish a code plugin or bundle plugin from a folder or GitHub source")
  .argument("<source>", "Package folder path, GitHub repo (owner/repo[@ref]), or URL")
  .option("--family <family>", "code-plugin|bundle-plugin")
  .option("--name <name>", "Package name")
  .option("--display-name <name>", "Display name")
  .option("--owner <handle>", "Publish under this owner handle (admin only)")
  .option("--version <version>", "Version")
  .option("--changelog <text>", "Changelog text")
  .option(
    "--manual-override-reason <reason>",
    "Required for manual publish when trusted publisher config exists",
  )
  .option("--tags <tags>", "Comma-separated tags", "latest")
  .option("--bundle-format <format>", "Bundle format")
  .option("--host-targets <targets>", "Comma-separated bundle host targets")
  .option("--source-repo <repo>", "GitHub repo (owner/repo or URL)")
  .option("--source-commit <sha>", "Git commit SHA")
  .option("--source-ref <ref>", "Git ref/tag/branch")
  .option("--source-path <path>", "Repo subpath")
  .option("--dry-run", "Preview what would be published without uploading")
  .option("--json", "Output JSON (for CI pipelines)")
  .action(async (source, options) => {
    const opts = await resolveNetworkOpts();
    await cmdPublishPackage(opts, source, options);
  });

const trustedPublisherCmd = packageCmd
  .command("trusted-publisher")
  .description("Manage package trusted publisher config");

trustedPublisherCmd
  .command("get")
  .description("Show trusted publisher config for a package")
  .argument("<name>", "Package name")
  .option("--json", "Output JSON")
  .action(async (name, options) => {
    const opts = await resolveNetworkOpts();
    await cmdGetPackageTrustedPublisher(opts, name, options);
  });

trustedPublisherCmd
  .command("set")
  .description("Attach or replace trusted publisher config for a package")
  .argument("<name>", "Package name")
  .requiredOption("--repository <repo>", "GitHub repo (owner/repo or URL)")
  .requiredOption("--workflow-filename <file>", "Workflow filename, for example publish.yml")
  .option("--environment <name>", "Optional GitHub environment name to pin")
  .option("--json", "Output JSON")
  .action(async (name, options) => {
    const opts = await resolveNetworkOpts();
    await cmdSetPackageTrustedPublisher(opts, name, options);
  });

trustedPublisherCmd
  .command("delete")
  .description("Remove trusted publisher config from a package")
  .argument("<name>", "Package name")
  .option("--json", "Output JSON")
  .action(async (name, options) => {
    const opts = await resolveNetworkOpts();
    await cmdDeletePackageTrustedPublisher(opts, name, options);
  });

motion
  .command("rename")
  .description("Rename a published motion and keep the old slug as a redirect")
  .argument("<slug>", "Current motion slug")
  .argument("<new-slug>", "New canonical slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, newSlug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdRenameSkill(opts, slug, newSlug, options, isInputAllowed());
  });

motion
  .command("merge")
  .description("Merge one owned motion into another and redirect the old slug")
  .argument("<source-slug>", "Source motion slug")
  .argument("<target-slug>", "Target canonical slug")
  .option("--yes", "Skip confirmation")
  .action(async (sourceSlug, targetSlug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdMergeSkill(opts, sourceSlug, targetSlug, options, isInputAllowed());
  });

program
  .command("ban-user")
  .description("Ban a user and delete owned motions (moderator/admin only)")
  .argument("<handleOrId>", "User handle (default) or user id")
  .option("--id", "Treat argument as user id")
  .option("--fuzzy", "Resolve handle via fuzzy user search (admin only)")
  .option("--reason <reason>", "Ban reason (optional)")
  .option("--yes", "Skip confirmation")
  .action(async (handleOrId, options) => {
    const opts = await resolveNetworkOpts();
    await cmdBanUser(opts, handleOrId, options, isInputAllowed());
  });

program
  .command("set-role")
  .description("Change a user role (admin only)")
  .argument("<handleOrId>", "User handle (default) or user id")
  .argument("<role>", "user | moderator | admin")
  .option("--id", "Treat argument as user id")
  .option("--fuzzy", "Resolve handle via fuzzy user search (admin only)")
  .option("--yes", "Skip confirmation")
  .action(async (handleOrId, role, options) => {
    const opts = await resolveNetworkOpts();
    await cmdSetRole(opts, handleOrId, role, options, isInputAllowed());
  });

const transfer = program.command("transfer").description("Transfer motion ownership");

transfer
  .command("request")
  .description("Request motion transfer to another user")
  .argument("<slug>", "Motion slug")
  .argument("<handle>", "Recipient handle (e.g., @username)")
  .option("--message <text>", "Optional message for recipient")
  .option("--yes", "Skip confirmation")
  .action(async (slug, handle, options) => {
    const opts = await resolveNetworkOpts();
    await cmdTransferRequest(opts, slug, handle, options, isInputAllowed());
  });

transfer
  .command("list")
  .description("List pending transfer requests")
  .option("--outgoing", "Show outgoing transfer requests")
  .action(async (options) => {
    const opts = await resolveNetworkOpts();
    await cmdTransferList(opts, options);
  });

transfer
  .command("accept")
  .description("Accept incoming transfer for a motion")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdTransferAccept(opts, slug, options, isInputAllowed());
  });

transfer
  .command("reject")
  .description("Reject incoming transfer for a motion")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdTransferReject(opts, slug, options, isInputAllowed());
  });

transfer
  .command("cancel")
  .description("Cancel outgoing transfer for a motion")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdTransferCancel(opts, slug, options, isInputAllowed());
  });

program
  .command("star")
  .description("Add a motion to your highlights")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdStarSkill(opts, slug, options, isInputAllowed());
  });

program
  .command("unstar")
  .description("Remove a motion from your highlights")
  .argument("<slug>", "Motion slug")
  .option("--yes", "Skip confirmation")
  .action(async (slug, options) => {
    const opts = await resolveNetworkOpts();
    await cmdUnstarSkill(opts, slug, options, isInputAllowed());
  });

program
  .command("upgrade")
  .alias("self-update")
  .description("Upgrade the UI2V CLI from npm")
  .action(async () => {
    await cmdUpgrade({ inputAllowed: isInputAllowed() });
  });

program
  .command("sync")
  .description("Scan local motions and publish new/updated ones")
  .option("--root <dir...>", "Extra scan roots (one or more)")
  .option("--all", "Upload all new/updated motions without prompting")
  .option("--dry-run", "Show what would be uploaded")
  .option("--bump <type>", "Version bump for updates (patch|minor|major)", "patch")
  .option("--changelog <text>", "Changelog to use for updates (non-interactive)")
  .option("--tags <tags>", "Comma-separated tags", "latest")
  .option("--concurrency <n>", "Concurrent registry checks (default: 4)", "4")
  .action(async (options) => {
    const opts = await resolveNetworkOpts();
    const bump = String(options.bump ?? "patch") as "patch" | "minor" | "major";
    if (!["patch", "minor", "major"].includes(bump)) fail("--bump must be patch|minor|major");
    const concurrencyRaw = Number(options.concurrency ?? 4);
    const concurrency = Number.isFinite(concurrencyRaw) ? Math.round(concurrencyRaw) : 4;
    if (concurrency < 1 || concurrency > 32) fail("--concurrency must be between 1 and 32");
    await cmdSync(
      opts,
      {
        root: options.root,
        all: options.all,
        dryRun: options.dryRun,
        bump,
        changelog: options.changelog,
        tags: options.tags,
        concurrency,
      },
      isInputAllowed(),
    );
  });

program.action(async () => {
  const opts = await resolveNetworkOpts();
  const cfg = await readGlobalConfig();
  if (cfg?.token) {
    await cmdSync(opts, {}, isInputAllowed());
    return;
  }
  program.outputHelp();
  process.exitCode = 0;
});

void program.parseAsync(process.argv).catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
