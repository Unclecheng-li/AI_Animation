/* @vitest-environment node */

import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createAuthTokenModuleMocks,
  createHttpModuleMocks,
  createRegistryModuleMocks,
  createUiModuleMocks,
  makeGlobalOpts,
} from "../../../test/cliCommandTestKit.js";

const authTokenMocks = createAuthTokenModuleMocks();
const registryMocks = createRegistryModuleMocks();
const httpMocks = createHttpModuleMocks();
const uiMocks = createUiModuleMocks();

vi.mock("../authToken.js", () => authTokenMocks.moduleFactory());
vi.mock("../registry.js", () => registryMocks.moduleFactory());
vi.mock("../../http.js", () => httpMocks.moduleFactory());
vi.mock("../ui.js", () => uiMocks.moduleFactory());

const { cmdPublish } = await import("./publish.js");

async function makeTmpWorkdir() {
  const root = await mkdtemp(join(tmpdir(), "ui2v-publish-"));
  return root;
}

function makeOpts(workdir: string) {
  return makeGlobalOpts(workdir);
}

const SAMPLE_ITEM = {
  name: "logo-sting",
  type: "hyperframes:block",
  title: "Logo Sting",
  description: "A short logo reveal",
  dimensions: { width: 1920, height: 1080 },
  duration: 3,
  files: [{ path: "index.html", type: "hyperframes:composition" }],
};

const SAMPLE_HTML = `<!doctype html><html><body>
<div data-composition-id="logo-sting" data-duration="3" data-width="1920" data-height="1080">
  <div class="clip" data-start="0" data-duration="3" data-track-index="0"></div>
</div>
<script>window.__timelines=window.__timelines||{};window.__timelines["logo-sting"]=gsap.timeline({paused:true});</script>
</body></html>`;

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("cmdPublish", () => {
  it("publishes HyperFrames package from disk (mocked HTTP)", async () => {
    const workdir = await makeTmpWorkdir();
    try {
      const folder = join(workdir, "logo-sting");
      await mkdir(folder, { recursive: true });
      await writeFile(join(folder, "registry-item.json"), JSON.stringify(SAMPLE_ITEM), "utf8");
      await writeFile(join(folder, "index.html"), SAMPLE_HTML, "utf8");
      await writeFile(join(folder, "notes.md"), "notes\n", "utf8");

      httpMocks.apiRequestForm.mockResolvedValueOnce({
        ok: true,
        motionId: "skill_1",
        versionId: "ver_1",
      });

      await cmdPublish(makeOpts(workdir), "logo-sting", {
        slug: "logo-sting",
        name: "Logo Sting",
        version: "1.0.0",
        changelog: "",
        tags: "latest",
      });

      const publishCall = httpMocks.apiRequestForm.mock.calls.find((call) => {
        const req = call[1] as { path?: string } | undefined;
        return req?.path === "/api/v1/motions";
      });
      if (!publishCall) throw new Error("Missing publish call");
      const publishForm = (publishCall[1] as { form?: FormData }).form as FormData;
      const payloadEntry = publishForm.get("payload");
      if (typeof payloadEntry !== "string") throw new Error("Missing publish payload");
      const payload = JSON.parse(payloadEntry);
      expect(payload.slug).toBe("logo-sting");
      expect(payload.displayName).toBe("Logo Sting");
      expect(payload.version).toBe("1.0.0");
      expect(payload.acceptLicenseTerms).toBe(true);
      expect(payload.tags).toEqual(["latest"]);

      const files = publishForm.getAll("files");
      expect(files.map((file) => (file as File).name ?? "").sort()).toEqual([
        "index.html",
        "notes.md",
        "registry-item.json",
      ]);
    } finally {
      await rm(workdir, { recursive: true, force: true });
    }
  });

  it("rejects folders without registry-item.json", async () => {
    const workdir = await makeTmpWorkdir();
    try {
      const folder = join(workdir, "bad");
      await mkdir(folder, { recursive: true });
      await writeFile(join(folder, "index.html"), SAMPLE_HTML, "utf8");

      await expect(
        cmdPublish(makeOpts(workdir), "bad", {
          slug: "bad",
          name: "Bad",
          version: "1.0.0",
        }),
      ).rejects.toThrow(/registry-item\.json/i);
    } finally {
      await rm(workdir, { recursive: true, force: true });
    }
  });
});
