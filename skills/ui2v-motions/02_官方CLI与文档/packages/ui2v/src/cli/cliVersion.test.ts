/* @vitest-environment node */

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  compareCliVersions,
  fetchNpmLatestVersion,
  isCliBehind,
  UI2V_UPGRADE_COMMAND,
} from "./cliVersion.js";

describe("cliVersion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("compares semver-ish versions", () => {
    expect(compareCliVersions("0.9.0", "0.10.0")).toBe(-1);
    expect(compareCliVersions("0.10.0", "0.10.0")).toBe(0);
    expect(compareCliVersions("0.11.0", "0.10.0")).toBe(1);
    expect(isCliBehind("0.9.9", "0.10.0")).toBe(true);
    expect(isCliBehind("0.10.0", "0.10.0")).toBe(false);
  });

  it("fetches npm latest version", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(JSON.stringify({ version: "0.10.1" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    ) as unknown as typeof fetch;
    await expect(fetchNpmLatestVersion("@ui2v/cli", fetchImpl)).resolves.toBe("0.10.1");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://registry.npmjs.org/%40ui2v%2Fcli/latest",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("returns null when package is missing on npm", async () => {
    const fetchImpl = vi.fn(
      async () => new Response("Not Found", { status: 404 }),
    ) as unknown as typeof fetch;
    await expect(fetchNpmLatestVersion("@ui2v/cli", fetchImpl)).resolves.toBeNull();
  });

  it("exposes a stable upgrade command string", () => {
    expect(UI2V_UPGRADE_COMMAND).toBe("npm install -g @ui2v/cli@latest");
  });
});
