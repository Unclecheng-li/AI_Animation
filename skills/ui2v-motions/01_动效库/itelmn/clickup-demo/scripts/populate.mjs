// Populate the Demo workspace with a realistic "Q2 Product Launch" list so
// the capture session has something to film. Uses ClickUp's REST API v2.
//
// - Discovers the first Space in the team
// - Creates a new List called "Q2 Product Launch"
// - Creates ~18 tasks with varied statuses, priorities, due dates, tags
// - Writes out the new list_id so capture scripts know where to go

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..", "..");

// Minimal .env parser — avoids adding dotenv as a dep.
const envText = fs.readFileSync(path.join(workspaceRoot, ".env"), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const API_KEY = env.CLICKUP_API_KEY;
if (!API_KEY) throw new Error(".env is missing CLICKUP_API_KEY");

const TEAM_ID = "90141152666"; // from inventory

const api = async (method, url, body) => {
  const res = await fetch(`https://api.clickup.com/api/v2${url}`, {
    method,
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    console.error(`  [api] ${method} ${url} → ${res.status}`, json);
    throw new Error(`ClickUp API ${res.status}`);
  }
  return json;
};

// ---------- Discover space ----------
const { spaces } = await api("GET", `/team/${TEAM_ID}/space?archived=false`);
if (!spaces?.length) throw new Error("No spaces in team");
const space = spaces[0];
console.log(`  [pop] Using space: ${space.name} (${space.id})`);

// ---------- Get or create the list ----------
const folderless = await api("GET", `/space/${space.id}/list?archived=false`);
let list = folderless.lists?.find((l) => l.name === "Q2 Product Launch");
if (!list) {
  list = await api("POST", `/space/${space.id}/list`, {
    name: "Q2 Product Launch",
    content: "Cross-functional launch plan. Marketing, product, sales, success.",
    due_date_time: false,
    priority: 2,
  });
  console.log(`  [pop] Created list: ${list.name} (${list.id})`);
} else {
  console.log(`  [pop] List exists: ${list.name} (${list.id}) — will append new tasks`);
}

// ---------- Task seed ----------
// Spread due dates across ~4 weeks starting today. Mix priorities + statuses.
const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const D = (d) => now + d * day;

// ClickUp default statuses on new lists are: to do, in progress, complete.
// If the space uses custom statuses, we'll fall back to "to do".
const seed = [
  ["Write product launch announcement", "in progress", 1, D(3), ["content"]],
  ["Design launch graphics for LinkedIn", "in progress", 2, D(5), ["design", "social"]],
  ["Record demo video", "in progress", 1, D(7), ["video"]],
  ["Brief PR agency on launch timeline", "complete", 3, D(-2), ["pr"]],
  ["Finalize pricing page copy", "complete", 2, D(-1), ["content", "pricing"]],
  ["Set up GA4 events for launch", "in progress", 2, D(4), ["analytics"]],
  ["QA enterprise signup flow", "in progress", 1, D(2), ["qa"]],
  ["Schedule launch day tweets", "to do", 3, D(10), ["social"]],
  ["Coordinate with customer success", "to do", 2, D(8), ["cs"]],
  ["Draft press release", "to do", 2, D(6), ["pr", "content"]],
  ["Build launch microsite", "in progress", 1, D(9), ["engineering", "web"]],
  ["Usability test on pricing page", "complete", 2, D(-4), ["research"]],
  ["Align with legal on product claims", "in progress", 1, D(3), ["legal"]],
  ["Prepare sales enablement deck", "to do", 2, D(11), ["sales"]],
  ["Launch webinar invite list", "to do", 3, D(14), ["webinar"]],
  ["Onboarding email sequence", "in progress", 2, D(5), ["lifecycle"]],
  ["Final QA on mobile responsive", "to do", 1, D(7), ["qa", "web"]],
  ["Launch day warroom agenda", "to do", 3, D(13), ["ops"]],
];

// Map to ClickUp API. Priority: 1=urgent, 2=high, 3=normal, 4=low.
let created = 0;
for (const [name, status, priority, due, tags] of seed) {
  try {
    const task = await api("POST", `/list/${list.id}/task`, {
      name,
      status,
      priority,
      due_date: due,
      due_date_time: false,
      notify_all: false,
      tags,
    });
    created++;
    process.stdout.write(".");
  } catch (err) {
    // Retry without status if custom statuses rejected it.
    try {
      await api("POST", `/list/${list.id}/task`, {
        name,
        priority,
        due_date: due,
        due_date_time: false,
        notify_all: false,
        tags,
      });
      created++;
      process.stdout.write("·");
    } catch (err2) {
      process.stdout.write("!");
      console.error(`\n  [pop] failed: ${name} — ${err2.message}`);
    }
  }
}
console.log(`\n  [pop] Created ${created}/${seed.length} tasks in list ${list.id}`);

// Save context for capture scripts.
const ctx = {
  timestamp: new Date().toISOString(),
  teamId: TEAM_ID,
  spaceId: space.id,
  spaceName: space.name,
  listId: list.id,
  listName: list.name,
  listUrl: `https://app.clickup.com/${TEAM_ID}/v/l/li/${list.id}`,
  boardUrl: `https://app.clickup.com/${TEAM_ID}/v/b/li/${list.id}`,
  calendarUrl: `https://app.clickup.com/${TEAM_ID}/v/c/li/${list.id}`,
  ganttUrl: `https://app.clickup.com/${TEAM_ID}/v/g/li/${list.id}`,
};
fs.writeFileSync(path.join(__dirname, "..", "workspace-context.json"), JSON.stringify(ctx, null, 2));
console.log(`  [pop] Wrote workspace-context.json`);
console.log(`  [pop] List URL: ${ctx.listUrl}`);
