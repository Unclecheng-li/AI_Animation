// Second pass: assign Nate to several tasks, add subtasks to 3 parents,
// drop a few comments. Uses workspace-context.json written by populate.mjs.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "..");

const env = Object.fromEntries(
  fs.readFileSync(path.join(root, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const API_KEY = env.CLICKUP_API_KEY;

const ctx = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "workspace-context.json"), "utf8"),
);

const api = async (method, url, body) => {
  const res = await fetch(`https://api.clickup.com/api/v2${url}`, {
    method,
    headers: { Authorization: API_KEY, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await res.text();
  const j = (() => { try { return JSON.parse(t); } catch { return { raw: t }; } })();
  if (!res.ok) throw new Error(`${res.status} ${url} ${JSON.stringify(j)}`);
  return j;
};

// 1. Get the team to find user id.
const { team } = await api("GET", `/team/${ctx.teamId}`);
const me = team.members.find((m) => m.user.username.toLowerCase().includes("nate")) ?? team.members[0];
const userId = me.user.id;
console.log(`  [enrich] user = ${me.user.username} (${userId})`);

// 2. Get the list's tasks.
const { tasks } = await api("GET", `/list/${ctx.listId}/task?include_closed=false&subtasks=true`);
console.log(`  [enrich] ${tasks.length} tasks in list`);

// 3. Assign self to every non-complete task so the list shows avatars.
const owned = tasks.filter((t) => t.status.status.toLowerCase() !== "complete").slice(0, 12);
for (const t of owned) {
  await api("PUT", `/task/${t.id}`, { assignees: { add: [userId], rem: [] } });
  process.stdout.write("a");
}
console.log(`\n  [enrich] assigned ${owned.length} tasks`);

// 4. Add subtasks to 3 meaty parents.
const subtaskPlan = {
  "Record demo video": [
    "Write 60-sec script",
    "Record voiceover",
    "Edit final cut",
    "Export 1080p + caption variant",
  ],
  "Build launch microsite": [
    "Wire up hero + pricing section",
    "Integrate Stripe checkout",
    "Pass Lighthouse > 95",
    "Add event tracking",
  ],
  "Onboarding email sequence": [
    "Day 0: welcome + 5-min win",
    "Day 2: feature deep dive",
    "Day 5: case study",
    "Day 7: trial expiry nudge",
  ],
};

for (const parentName of Object.keys(subtaskPlan)) {
  const parent = tasks.find((t) => t.name === parentName);
  if (!parent) continue;
  for (const subName of subtaskPlan[parentName]) {
    await api("POST", `/list/${ctx.listId}/task`, {
      name: subName,
      parent: parent.id,
      assignees: [userId],
      priority: 3,
    });
    process.stdout.write("s");
  }
}
console.log(`\n  [enrich] added subtasks`);

// 5. Comments on 3 tasks.
const commentPlan = {
  "Write product launch announcement": "Draft v2 posted in Google Doc — need legal sign-off by EOD Thursday.",
  "QA enterprise signup flow": "Found SSO edge case on Okta tenant. Spinning up a fix branch now.",
  "Finalize pricing page copy": "Shipped. Conversion already up 8% on the /pricing A test.",
};
for (const [taskName, text] of Object.entries(commentPlan)) {
  const t = tasks.find((x) => x.name === taskName);
  if (!t) continue;
  await api("POST", `/task/${t.id}/comment`, {
    comment_text: text,
    assignee: null,
    notify_all: false,
  });
  process.stdout.write("c");
}
console.log(`\n  [enrich] done.`);
