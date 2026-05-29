import assert from "node:assert/strict";
import {
  buildReplayUrl,
  buildInitialOrder,
  buildShareText,
  cases,
  evaluateOrder,
  moveItem,
  normalizeSeed,
  orderedArtifacts,
  swapItems
} from "../src/game.js";

assert.equal(cases.length, 3, "three compact cases are available");

for (const caseFile of cases) {
  const answer = orderedArtifacts(caseFile).map((artifact) => artifact.id);
  const initial = buildInitialOrder(caseFile);
  assert.equal(new Set(initial).size, answer.length, `${caseFile.id} has a valid shuffle`);
  assert.notDeepEqual(initial, answer, `${caseFile.id} starts scrambled`);
  assert.deepEqual(initial, buildInitialOrder(caseFile), `${caseFile.id} shuffle is deterministic for the same seed`);

  const solved = evaluateOrder(caseFile, answer, 0, 0);
  assert.equal(solved.solved, true, `${caseFile.id} can be solved`);
  assert.equal(solved.exact, answer.length, `${caseFile.id} returns exact markers`);
  assert.ok(solved.score > 900, `${caseFile.id} has a high perfect score`);

  const moved = moveItem(answer, 0, 1);
  assert.equal(moved[1], answer[0], `${caseFile.id} moveItem changes order`);
  const swapped = swapItems(answer, answer[0], answer[5]);
  assert.equal(swapped[5], answer[0], `${caseFile.id} swapItems changes order`);

  const partial = evaluateOrder(caseFile, initial, 4, 24);
  assert.equal(partial.solved, false, `${caseFile.id} detects unsolved shuffles`);
  assert.ok(partial.score < solved.score, `${caseFile.id} scores partial lower`);
}

const seededA = buildInitialOrder(cases[0], "museum-night");
const seededB = buildInitialOrder(cases[0], "museum-night");
const seededC = buildInitialOrder(cases[0], "museum-morning");
assert.deepEqual(seededA, seededB, "same replay seed keeps the same opening order");
assert.notDeepEqual(seededA, seededC, "different replay seeds change the opening order");

assert.equal(normalizeSeed("  Museum Night!  "), "museum-night", "seed input is normalized");
const replayUrl = buildReplayUrl("https://example.com/time-heist", "Museum Night!");
assert.equal(
  replayUrl,
  "https://example.com/time-heist?seed=museum-night",
  "replay urls carry the normalized seed"
);

const share = buildShareText(
  cases.map((caseFile) => evaluateOrder(caseFile, orderedArtifacts(caseFile).map((item) => item.id))),
  {
    seed: "Museum Night!",
    replayUrl
  }
);
assert.match(share, /Time Heist Shuffle 2026-05-23/);
assert.match(share, /3\/3 cases solved/);
assert.match(share, /Seed: museum-night/);
assert.match(share, /Replay: https:\/\/example.com\/time-heist\?seed=museum-night/);

console.log("Smoke tests passed: cases, scoring, seeded replay, moves, swaps, and share text.");
