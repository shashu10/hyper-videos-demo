#!/usr/bin/env node

import { access, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const reelsRoot = path.join(repoRoot, "reels");
const styleRoot = path.join(repoRoot, "style-systems");
const [command, target, ...forwardedArgs] = process.argv.slice(2);

async function discoverReels() {
  const choices = [];
  for (const collection of ["ai"]) {
    const collectionDir = path.join(reelsRoot, collection);
    for (const entry of await readdir(collectionDir, { withFileTypes: true })) {
      if (entry.isDirectory()) choices.push(`${collection}/${entry.name}`);
    }
  }
  choices.push("@ai-release");
  return choices.sort();
}

function resolveTarget(value) {
  if (value === "@ai-release") {
    return path.join(styleRoot, "ai-release", "gallery");
  }

  if (!/^ai\/[a-z0-9][a-z0-9-]*$/.test(value || "")) {
    return null;
  }

  const projectDir = path.resolve(reelsRoot, value);
  return projectDir.startsWith(`${reelsRoot}${path.sep}`) ? projectDir : null;
}

if (!target) {
  const choices = await discoverReels();
  console.error(`usage: npm run ${command} -- <collection>/<reel> [args...]`);
  console.error(`available: ${choices.join(", ")}`);
  process.exit(1);
}

const projectDir = resolveTarget(target);
if (!projectDir) {
  console.error(`invalid reel target: ${target}`);
  console.error("expected ai/<name> or @ai-release");
  process.exit(1);
}

try {
  await access(path.join(projectDir, "package.json"), constants.R_OK);
} catch {
  console.error(`no HyperFrames project found at ${projectDir}`);
  process.exit(1);
}

const child = spawn("npm", ["run", command, "--", ...forwardedArgs], {
  cwd: projectDir,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
