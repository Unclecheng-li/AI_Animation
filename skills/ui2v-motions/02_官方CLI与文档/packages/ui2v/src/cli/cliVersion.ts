import { spawn } from "node:child_process";
import semver from "semver";
import { getCliVersion } from "./buildInfo.js";

export const UI2V_NPM_PACKAGE = "@ui2v/cli";
export const UI2V_UPGRADE_COMMAND = `npm install -g ${UI2V_NPM_PACKAGE}@latest`;

export function compareCliVersions(local: string, remote: string) {
  const left = semver.coerce(local)?.version;
  const right = semver.coerce(remote)?.version;
  if (!left || !right) return 0;
  return semver.compare(left, right);
}

export function isCliBehind(local: string, remote: string) {
  return compareCliVersions(local, remote) < 0;
}

export async function fetchNpmLatestVersion(
  packageName = UI2V_NPM_PACKAGE,
  fetchImpl: typeof fetch = fetch,
) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`;
  const response = await fetchImpl(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to look up ${packageName} on npm (HTTP ${response.status})`);
  }
  const raw = (await response.json()) as { version?: unknown };
  if (typeof raw.version !== "string" || !raw.version.trim()) {
    throw new Error(`npm registry response for ${packageName} is missing version`);
  }
  return raw.version.trim();
}

export function getLocalCliVersion() {
  return getCliVersion();
}

export function runNpmGlobalUpgrade(packageName = UI2V_NPM_PACKAGE) {
  return new Promise<{ code: number; stdout: string; stderr: string }>((resolvePromise) => {
    const child = spawn(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["install", "-g", `${packageName}@latest`],
      {
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    child.stdout?.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr?.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.on("error", (error) => {
      resolvePromise({
        code: 1,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: `${Buffer.concat(stderr).toString("utf8")}${error.message}`,
      });
    });
    child.on("close", (code) => {
      resolvePromise({
        code: code ?? 1,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
      });
    });
  });
}
