/* @vitest-environment node */
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { resolveHome } from "../homedir.js";
import { resolveClawdbotDefaultWorkspace, resolveClawdbotSkillRoots } from "./clawdbotConfig.js";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

function pathForJson(value: string) {
  return value.replaceAll("\\", "/");
}

describe("resolveClawdbotSkillRoots", () => {
  it("reads JSON5 config and resolves per-agent + shared skill roots", async () => {
    const base = await mkdtemp(join(tmpdir(), "ui2v-clawdbot-"));
    const home = join(base, "home");
    const stateDir = join(base, "state");
    const configPath = join(base, "clawdbot.json");
    const openclawStateDir = join(base, "openclaw-state");

    process.env.HOME = home;
    process.env.CLAWDBOT_STATE_DIR = stateDir;
    process.env.CLAWDBOT_CONFIG_PATH = configPath;
    process.env.OPENCLAW_STATE_DIR = openclawStateDir;
    process.env.OPENCLAW_CONFIG_PATH = join(openclawStateDir, "openclaw.json");

    const config = `{
      // JSON5 comments + trailing commas supported
      agents: {
        defaults: { workspace: '~/clawd-main', },
        list: [
          { id: 'work', name: 'Work Bot', workspace: '~/clawd-work', },
          { id: 'family', workspace: '~/clawd-family', },
        ],
      },
      // legacy entries still supported
      agent: { workspace: '~/clawd-legacy', },
      routing: {
        agents: {
          work: { name: 'Work Bot', workspace: '~/clawd-work', },
          family: { workspace: '~/clawd-family' },
        },
      },
      motions: {
        load: { extraDirs: ['~/shared/motions', '/opt/motions',], },
      },
    }`;
    await writeFile(configPath, config, "utf8");

    const { roots, labels } = await resolveClawdbotSkillRoots();

    const expectedRoots = [
      resolve(stateDir, "motions"),
      resolve(openclawStateDir, "motions"),
      resolve(home, "clawd-main", "motions"),
      resolve(home, "clawd-work", "motions"),
      resolve(home, "clawd-family", "motions"),
      resolve(home, "shared", "motions"),
      resolve("/opt/motions"),
    ];

    expect(roots).toEqual(expect.arrayContaining(expectedRoots));
    expect(labels[resolve(stateDir, "motions")]).toBe("Shared motions");
    expect(labels[resolve(openclawStateDir, "motions")]).toBe("OpenClaw: Shared motions");
    expect(labels[resolve(home, "clawd-main", "motions")]).toBe("Agent: main");
    expect(labels[resolve(home, "clawd-work", "motions")]).toBe("Agent: Work Bot");
    expect(labels[resolve(home, "clawd-family", "motions")]).toBe("Agent: family");
    expect(labels[resolve(home, "shared", "motions")]).toBe("Extra: motions");
    expect(labels[resolve("/opt/motions")]).toBe("Extra: motions");
  });

  it("resolves default workspace from agents.defaults and agents.list", async () => {
    const base = await mkdtemp(join(tmpdir(), "ui2v-clawdbot-default-"));
    const home = join(base, "home");
    const stateDir = join(base, "state");
    const configPath = join(base, "clawdbot.json");
    const workspaceMain = join(base, "workspace-main");
    const workspaceList = join(base, "workspace-list");
    const openclawStateDir = join(base, "openclaw-state");

    process.env.HOME = home;
    process.env.CLAWDBOT_STATE_DIR = stateDir;
    process.env.CLAWDBOT_CONFIG_PATH = configPath;
    process.env.OPENCLAW_STATE_DIR = openclawStateDir;
    process.env.OPENCLAW_CONFIG_PATH = join(openclawStateDir, "openclaw.json");

    const config = `{
      agents: {
        defaults: { workspace: "${pathForJson(workspaceMain)}", },
        list: [
          { id: 'main', workspace: "${pathForJson(workspaceList)}", default: true },
        ],
      },
    }`;
    await writeFile(configPath, config, "utf8");

    const workspace = await resolveClawdbotDefaultWorkspace();
    expect(workspace).toBe(resolve(workspaceMain));
  });

  it("falls back to default agent in agents.list when defaults missing", async () => {
    const base = await mkdtemp(join(tmpdir(), "ui2v-clawdbot-list-"));
    const home = join(base, "home");
    const configPath = join(base, "clawdbot.json");
    const workspaceMain = join(base, "workspace-main");
    const workspaceWork = join(base, "workspace-work");
    const openclawStateDir = join(base, "openclaw-state");

    process.env.HOME = home;
    process.env.CLAWDBOT_STATE_DIR = join(base, "state");
    process.env.CLAWDBOT_CONFIG_PATH = configPath;
    process.env.OPENCLAW_STATE_DIR = openclawStateDir;
    process.env.OPENCLAW_CONFIG_PATH = join(openclawStateDir, "openclaw.json");

    const config = `{
      agents: {
        list: [
          { id: 'main', workspace: "${pathForJson(workspaceMain)}", default: true },
          { id: 'work', workspace: "${pathForJson(workspaceWork)}" },
        ],
      },
    }`;
    await writeFile(configPath, config, "utf8");

    const workspace = await resolveClawdbotDefaultWorkspace();
    expect(workspace).toBe(resolve(workspaceMain));
  });

  it("respects CLAWDBOT_STATE_DIR and CLAWDBOT_CONFIG_PATH overrides", async () => {
    const base = await mkdtemp(join(tmpdir(), "ui2v-clawdbot-override-"));
    const home = join(base, "home");
    const stateDir = join(base, "custom-state");
    const configPath = join(base, "config", "clawdbot.json");
    const openclawStateDir = join(base, "openclaw-state");

    process.env.HOME = home;
    process.env.CLAWDBOT_STATE_DIR = stateDir;
    process.env.CLAWDBOT_CONFIG_PATH = configPath;
    process.env.OPENCLAW_STATE_DIR = openclawStateDir;
    process.env.OPENCLAW_CONFIG_PATH = join(openclawStateDir, "openclaw.json");

    const config = `{
      agents: {
        defaults: { workspace: "${pathForJson(join(base, "workspace-main"))}" },
      },
    }`;
    await mkdir(join(base, "config"), { recursive: true });
    await writeFile(configPath, config, "utf8");

    const { roots, labels } = await resolveClawdbotSkillRoots();

    expect(roots).toEqual(
      expect.arrayContaining([
        resolve(stateDir, "motions"),
        resolve(openclawStateDir, "motions"),
        resolve(join(base, "workspace-main"), "motions"),
      ]),
    );
    expect(labels[resolve(stateDir, "motions")]).toBe("Shared motions");
    expect(labels[resolve(openclawStateDir, "motions")]).toBe("OpenClaw: Shared motions");
    expect(labels[resolve(join(base, "workspace-main"), "motions")]).toBe("Agent: main");
  });

  it("returns shared motions root when config is missing", async () => {
    const base = await mkdtemp(join(tmpdir(), "ui2v-clawdbot-missing-"));
    const stateDir = join(base, "state");
    const configPath = join(base, "missing", "clawdbot.json");
    const openclawStateDir = join(base, "openclaw-state");

    process.env.CLAWDBOT_STATE_DIR = stateDir;
    process.env.CLAWDBOT_CONFIG_PATH = configPath;
    process.env.OPENCLAW_STATE_DIR = openclawStateDir;
    process.env.OPENCLAW_CONFIG_PATH = join(openclawStateDir, "openclaw.json");

    const { roots, labels } = await resolveClawdbotSkillRoots();

    expect(roots).toEqual([resolve(stateDir, "motions"), resolve(openclawStateDir, "motions")]);
    expect(labels[resolve(stateDir, "motions")]).toBe("Shared motions");
    expect(labels[resolve(openclawStateDir, "motions")]).toBe("OpenClaw: Shared motions");
  });

  it("uses $HOME over os.homedir() for tilde expansion", async () => {
    const base = await mkdtemp(join(tmpdir(), "ui2v-home-override-"));
    const customHome = join(base, "custom-home");
    const stateDir = join(base, "state");
    const configPath = join(base, "clawdbot.json");
    const openclawStateDir = join(base, "openclaw-state");

    process.env.HOME = customHome;
    process.env.CLAWDBOT_STATE_DIR = stateDir;
    process.env.CLAWDBOT_CONFIG_PATH = configPath;
    process.env.OPENCLAW_STATE_DIR = openclawStateDir;
    process.env.OPENCLAW_CONFIG_PATH = join(openclawStateDir, "openclaw.json");

    const config = `{
      agents: {
        defaults: { workspace: "~/my-workspace" },
      },
    }`;
    await writeFile(configPath, config, "utf8");

    const workspace = await resolveClawdbotDefaultWorkspace();
    expect(workspace).toBe(resolve(customHome, "my-workspace"));
    expect(resolveHome()).toBe(customHome);
  });

  it("normalizes trailing separators in $HOME", async () => {
    const base = await mkdtemp(join(tmpdir(), "ui2v-home-trailing-"));
    const customHome = join(base, "custom-home");

    process.env.HOME = `${customHome}/`;

    expect(resolveHome()).toBe(customHome);
  });

  it("supports OpenClaw configuration files", async () => {
    const base = await mkdtemp(join(tmpdir(), "ui2v-openclaw-"));
    const stateDir = join(base, "openclaw-state");
    const workspace = join(base, "openclaw-main");
    const configPath = join(stateDir, "openclaw.json");

    process.env.CLAWDBOT_STATE_DIR = join(base, "clawdbot-state");
    process.env.CLAWDBOT_CONFIG_PATH = join(base, "clawdbot-state", "clawdbot.json");
    process.env.OPENCLAW_STATE_DIR = stateDir;
    process.env.OPENCLAW_CONFIG_PATH = configPath;

    await mkdir(stateDir, { recursive: true });
    const config = `{
      agents: {
        defaults: { workspace: "${pathForJson(workspace)}", },
      },
    }`;
    await writeFile(configPath, config, "utf8");

    const { roots, labels } = await resolveClawdbotSkillRoots();
    expect(roots).toEqual(expect.arrayContaining([resolve(stateDir, "motions"), resolve(workspace, "motions")]));
    expect(labels[resolve(stateDir, "motions")]).toBe("OpenClaw: Shared motions");
    expect(labels[resolve(workspace, "motions")]).toBe("OpenClaw: Agent: main");
  });
});
