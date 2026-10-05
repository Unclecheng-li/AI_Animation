/* @vitest-environment node */

import { afterEach, describe, expect, it, vi } from "vitest";
import { createUiModuleMocks } from "../../../test/cliCommandTestKit.js";

const uiMocks = createUiModuleMocks();
vi.mock("../ui.js", () => uiMocks.moduleFactory());

const fetchNpmLatestVersion = vi.fn();
const getLocalCliVersion = vi.fn(() => "0.9.0");
const isCliBehind = vi.fn();
const runNpmGlobalUpgrade = vi.fn();

vi.mock("../cliVersion.js", () => ({
  UI2V_NPM_PACKAGE: "@ui2v/cli",
  UI2V_UPGRADE_COMMAND: "npm install -g @ui2v/cli@latest",
  fetchNpmLatestVersion: (...args: unknown[]) => fetchNpmLatestVersion(...args),
  getLocalCliVersion: () => getLocalCliVersion(),
  isCliBehind: (...args: unknown[]) => isCliBehind(...(args as [string, string])),
  runNpmGlobalUpgrade: (...args: unknown[]) => runNpmGlobalUpgrade(...args),
}));

const { cmdUpgrade } = await import("./upgrade.js");

describe("cmdUpgrade", () => {
  afterEach(() => {
    vi.clearAllMocks();
    getLocalCliVersion.mockReturnValue("0.9.0");
  });

  it("reports already latest", async () => {
    fetchNpmLatestVersion.mockResolvedValueOnce("0.9.0");
    isCliBehind.mockReturnValueOnce(false);
    await cmdUpgrade({ inputAllowed: true });
    expect(uiMocks.spinner.succeed).toHaveBeenCalled();
    expect(runNpmGlobalUpgrade).not.toHaveBeenCalled();
  });

  it("prints command and fails under --no-input when behind", async () => {
    fetchNpmLatestVersion.mockResolvedValueOnce("0.10.0");
    isCliBehind.mockReturnValueOnce(true);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await expect(cmdUpgrade({ inputAllowed: false })).rejects.toThrow(/outdated/i);
    expect(log).toHaveBeenCalledWith("Run: npm install -g @ui2v/cli@latest");
    expect(runNpmGlobalUpgrade).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it("runs npm global install when input allowed and behind", async () => {
    fetchNpmLatestVersion.mockResolvedValueOnce("0.10.0");
    isCliBehind.mockReturnValueOnce(true);
    runNpmGlobalUpgrade.mockResolvedValueOnce({ code: 0, stdout: "added 1", stderr: "" });
    await cmdUpgrade({ inputAllowed: true });
    expect(runNpmGlobalUpgrade).toHaveBeenCalled();
    expect(uiMocks.spinner.succeed).toHaveBeenCalled();
  });

  it("handles unpublished package", async () => {
    fetchNpmLatestVersion.mockResolvedValueOnce(null);
    await cmdUpgrade({ inputAllowed: true });
    expect(uiMocks.spinner.warn).toHaveBeenCalled();
    expect(runNpmGlobalUpgrade).not.toHaveBeenCalled();
  });
});
