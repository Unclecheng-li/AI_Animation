/* @vitest-environment node */

import { afterEach, describe, expect, it, vi } from "vitest";
import { createGlobalStubRegistry } from "../../test/runtimeStubs.js";
import { createUiModuleMocks, makeGlobalOpts } from "../../test/cliCommandTestKit.js";

const uiMocks = createUiModuleMocks();
vi.mock("./ui.js", () => uiMocks.moduleFactory());

const discoverRegistryFromSite = vi.fn();
vi.mock("../discovery.js", () => ({
  discoverRegistryFromSite: (...args: unknown[]) => discoverRegistryFromSite(...args),
}));

const getLocalCliVersion = vi.fn(() => "0.9.0");
const isCliBehind = vi.fn((local: string, remote: string) => local !== remote);
vi.mock("./cliVersion.js", async () => {
  const actual = await vi.importActual<typeof import("./cliVersion.js")>("./cliVersion.js");
  return {
    ...actual,
    getLocalCliVersion: () => getLocalCliVersion(),
    isCliBehind: (local: string, remote: string) => isCliBehind(local, remote),
    UI2V_UPGRADE_COMMAND: "npm install -g @ui2v/cli@latest",
  };
});

const { resetMinCliWarnForTests, warnIfCliBelowMin } = await import("./minCliWarn.js");

const globalStubs = createGlobalStubRegistry();

describe("warnIfCliBelowMin", () => {
  afterEach(() => {
    resetMinCliWarnForTests();
    globalStubs.restoreAll();
    vi.clearAllMocks();
    getLocalCliVersion.mockReturnValue("0.9.0");
    isCliBehind.mockImplementation((local: string, remote: string) => local !== remote);
  });

  it("warns once when below minCliVersion", async () => {
    const warn = vi.fn();
    globalStubs.stub("console", { ...console, warn } as Console);
    discoverRegistryFromSite.mockResolvedValue({
      apiBase: "https://ui2v.com",
      minCliVersion: "0.10.0",
    });

    const opts = makeGlobalOpts("/tmp");
    await warnIfCliBelowMin(opts);
    await warnIfCliBelowMin(opts);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("ui2v upgrade");
  });

  it("stays quiet when local meets minimum", async () => {
    const warn = vi.fn();
    globalStubs.stub("console", { ...console, warn } as Console);
    getLocalCliVersion.mockReturnValue("0.10.0");
    isCliBehind.mockReturnValue(false);
    discoverRegistryFromSite.mockResolvedValue({
      apiBase: "https://ui2v.com",
      minCliVersion: "0.10.0",
    });

    await warnIfCliBelowMin(makeGlobalOpts("/tmp"));
    expect(warn).not.toHaveBeenCalled();
  });
});
