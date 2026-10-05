import {
  fetchNpmLatestVersion,
  getLocalCliVersion,
  isCliBehind,
  runNpmGlobalUpgrade,
  UI2V_NPM_PACKAGE,
  UI2V_UPGRADE_COMMAND,
} from "../cliVersion.js";
import { createSpinner, fail, formatError } from "../ui.js";

export async function cmdUpgrade(options: { inputAllowed: boolean }) {
  const local = getLocalCliVersion();
  const spinner = createSpinner(`Checking npm for ${UI2V_NPM_PACKAGE}@latest`);
  try {
    const latest = await fetchNpmLatestVersion();
    if (!latest) {
      spinner.warn(
        `${UI2V_NPM_PACKAGE} is not published on npm yet. Local CLI is v${local}. When published, run: ${UI2V_UPGRADE_COMMAND}`,
      );
      return;
    }

    if (!isCliBehind(local, latest)) {
      spinner.succeed(`OK. Already on latest (v${local}).`);
      return;
    }

    spinner.info(`Update available: v${local} → v${latest}`);

    if (!options.inputAllowed) {
      console.log(`Run: ${UI2V_UPGRADE_COMMAND}`);
      fail(`CLI outdated (v${local} < v${latest}). Re-run without --no-input to upgrade, or run the command above.`);
    }

    const install = createSpinner(`Installing ${UI2V_NPM_PACKAGE}@latest globally`);
    const result = await runNpmGlobalUpgrade();
    if (result.code !== 0) {
      install.fail(result.stderr.trim() || `npm exited with code ${result.code}`);
      console.log(`Manual upgrade: ${UI2V_UPGRADE_COMMAND}`);
      fail("Upgrade failed");
    }
    install.succeed(`OK. Upgraded toward v${latest}. Verify with: ui2v --cli-version`);
    if (result.stdout.trim()) console.log(result.stdout.trim());
  } catch (error) {
    spinner.fail(formatError(error));
    throw error;
  }
}
