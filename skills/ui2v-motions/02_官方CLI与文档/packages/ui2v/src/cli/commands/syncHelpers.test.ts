/* @vitest-environment node */
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("../scanMotions.js", () => ({
  findSkillFolders: vi.fn(async (root: string) => {
    if (resolve(root) === resolve("/tmp/with-skill")) {
      return [{ folder: `${root}/demo`, slug: "demo", displayName: "Demo" }];
    }
    return [];
  }),
}));

const { scanRootsWithLabels } = await import("./syncHelpers.js");

describe("scanRootsWithLabels", () => {
  it("attaches labels to roots with motions", async () => {
    const roots = ["/tmp/with-skill", "/tmp/empty", "/tmp/with-skill"];
    const withSkill = resolve("/tmp/with-skill");
    const labels = { [withSkill]: "Agent: Work" };

    const result = await scanRootsWithLabels(roots, labels);

    expect(result.rootsWithSkills).toEqual([withSkill]);
    expect(result.rootLabels).toEqual({ [withSkill]: "Agent: Work" });
    expect(result.motions.map((skill) => skill.slug)).toEqual(["demo"]);
  });
});
