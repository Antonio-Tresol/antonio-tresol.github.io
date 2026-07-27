/**
 * Derive each card's "updated" date from GitHub instead of typing it by hand.
 *
 * Why this exists: the hand-maintained `updated:` fields drifted. At the time this
 * was written, four of eight were wrong — three of them went stale the same day
 * they were checked, from ordinary commits. A date nobody can forget to update is
 * worth more than a date that is expressive but false.
 *
 * How it finds the repos: by scanning Home.jsx for github.com URLs rather than
 * keeping a second list here. A list would be one more thing to forget.
 *
 * Failure policy: never break the build. If GitHub is unreachable, rate-limited,
 * or a repo has gone private, the previous value in repo-updated.json is kept and
 * the card falls back to its committed `updated:` string. A personal site failing
 * to deploy because an API was briefly down is a worse outcome than a stale month.
 *
 * Run: node scripts/fetch-updated.mjs   (wired into `npm run build`)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(here, "../src/pages/Home.jsx");
const OUTPUT = resolve(here, "../src/repo-updated.json");

const previous = existsSync(OUTPUT) ? JSON.parse(readFileSync(OUTPUT, "utf8")) : {};

// owner/repo from any github.com link. The trailing group stops at / # ? " so a
// deep link such as .../repo/blob/main/paper.pdf still yields just owner/repo.
const repos = [
  ...new Set(
    [...readFileSync(SOURCE, "utf8").matchAll(/github\.com\/([\w.-]+)\/([\w.-]+)/g)].map(
      (m) => `${m[1]}/${m[2]}`
    )
  ),
].filter((r) => !r.startsWith("Antonio-Tresol/antonio-tresol.github.io"));

// Actions provides GITHUB_TOKEN, which lifts the rate limit from 60/hr to 5000
// and makes the deploy path reliable. Locally it is absent and 60/hr is ample.
const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "antonio-tresol-site-build",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const result = { ...previous };
let fresh = 0;
let kept = 0;

for (const repo of repos) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { pushed_at } = await res.json();
    if (!pushed_at) throw new Error("no pushed_at in response");
    result[repo] = pushed_at;
    fresh += 1;
  } catch (err) {
    // Keep whatever we had; the card falls back to its committed string if we
    // never had anything. Warn loudly enough to notice in a build log.
    kept += 1;
    console.warn(`  warn: ${repo} -> ${err.message}; keeping ${previous[repo] ?? "(no prior value)"}`);
  }
}

writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + "\n");
console.log(
  `repo-updated.json: ${fresh} fetched, ${kept} kept, ${repos.length} repos${token ? "" : " (unauthenticated)"}`
);
