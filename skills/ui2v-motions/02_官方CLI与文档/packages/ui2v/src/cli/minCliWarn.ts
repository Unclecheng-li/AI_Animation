import { discoverRegistryFromSite } from "../discovery.js";
import { getLocalCliVersion, isCliBehind, UI2V_UPGRADE_COMMAND } from "./cliVersion.js";
import type { GlobalOpts } from "./types.js";

let warnedThisProcess = false;

/** Soft-check site minCliVersion once per process; never throws. */
export async function warnIfCliBelowMin(opts: GlobalOpts) {
  if (warnedThisProcess) return;
  try {
    const discovery = await discoverRegistryFromSite(opts.site);
    const min = discovery?.minCliVersion?.trim();
    if (!min) return;
    const local = getLocalCliVersion();
    if (!isCliBehind(local, min)) return;
    warnedThisProcess = true;
    console.warn(
      `CLI v${local} is below the site minimum (v${min}). Run \`${UI2V_UPGRADE_COMMAND}\` or \`ui2v upgrade\`.`,
    );
  } catch {
    // Discovery failures should not block registry commands.
  }
}

/** Test helper */
export function resetMinCliWarnForTests() {
  warnedThisProcess = false;
}
