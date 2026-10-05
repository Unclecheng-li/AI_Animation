/* @vitest-environment node */

import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { findSkillFolders, getFallbackSkillRoots } from "./scanMotions";

async function makeTmpDir() {
  return mkdtemp(join(tmpdir(), "ui2v-scan-"));
}

function normalizePath(value: string) {
  return value.replaceAll("\\", "/");
}

describe("scanMotions", () => {
  it("detects a single motion folder (root contains registry-item.json)", async () => {
    const root = await makeTmpDir();
    try {
      await writeFile(join(root, "registry-item.json"), "{}\n", "utf8");
      const found = await findSkillFolders(root);
      expect(found).toHaveLength(1);
      expect(found[0]?.folder).toBe(resolve(root));
      expect(found[0]?.slug).toBeTruthy();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("detects motions in a motions directory (subfolders)", async () => {
    const root = await makeTmpDir();
    try {
      const skillsDir = join(root, "motions");
      const folder = join(skillsDir, "cool-skill");
      await mkdir(folder, { recursive: true });
      await writeFile(join(folder, "registry-item.json"), "{}\n", "utf8");

      const found = await findSkillFolders(skillsDir);
      expect(found).toHaveLength(1);
      expect(found[0]?.slug).toBe("cool-skill");
      expect(found[0]?.folder).toBe(resolve(folder));
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("ignores folders without registry-item.json", async () => {
    const root = await makeTmpDir();
    try {
      await writeFile(join(root, "index.html"), "<html></html>\n", "utf8");
      const found = await findSkillFolders(root);
      expect(found).toHaveLength(0);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("returns unique fallback roots", () => {
    const roots = getFallbackSkillRoots("/tmp/workdir");
    expect(roots.length).toBeGreaterThan(0);
    expect(new Set(roots.map(normalizePath)).size).toBe(roots.length);
  });
});
