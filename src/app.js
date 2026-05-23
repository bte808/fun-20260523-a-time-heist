import {
  buildInitialOrder,
  buildShareText,
  cases,
  evaluateOrder,
  getArtifact,
  moveItem,
  orderedArtifacts,
  runDate,
  swapItems
} from "./game.js";

const timeline = document.querySelector("#timeline");
const caseProgress = document.querySelector("#caseProgress");
const scoreTotal = document.querySelector("#scoreTotal");
const caseTitle = document.querySelector("#caseTitle");
const caseBrief = document.querySelector("#caseBrief");
const clueList = document.querySelector("#clueList");
const resultPanel = document.querySelector("#resultPanel");
const lockButton = document.querySelector("#lockButton");
const resetButton = document.querySelector("#resetButton");
const summary = document.querySelector("#summary");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryText = document.querySelector("#summaryText");
const shareText = document.querySelector("#shareText");
const copyButton = document.querySelector("#copyButton");
const restartButton = document.querySelector("#restartButton");

const state = {
  caseIndex: 0,
  order: [],
  selectedId: null,
  moves: 0,
  startedAt: Date.now(),
  results: [],
  feedback: []
};

function currentCase() {
  return cases[state.caseIndex];
}

function startCase(index) {
  state.caseIndex = index;
  state.order = buildInitialOrder(currentCase());
  state.selectedId = null;
  state.moves = 0;
  state.startedAt = Date.now();
  state.feedback = [];
  resultPanel.textContent = "";
  render();
}

function render() {
  const caseFile = currentCase();
  const totalScore = state.results.reduce((sum, result) => sum + result.score, 0);
  caseProgress.textContent = `Case ${state.caseIndex + 1} / ${cases.length}`;
  scoreTotal.textContent = `${totalScore} pts`;
  caseTitle.textContent = caseFile.title;
  caseBrief.textContent = caseFile.brief;
  clueList.replaceChildren(
    ...caseFile.clues.map((clue) => {
      const item = document.createElement("li");
      item.textContent = clue;
      return item;
    })
  );
  timeline.replaceChildren(...state.order.map((id, index) => renderCard(caseFile, id, index)));
  lockButton.disabled = false;
  resetButton.disabled = false;
}

function renderCard(caseFile, artifactId, index) {
  const artifact = getArtifact(caseFile, artifactId);
  const feedback = state.feedback.find((item) => item.id === artifactId);
  const item = document.createElement("li");
  item.className = "artifact-card";
  item.style.setProperty("--artifact-hue", artifact.hue);
  item.dataset.state = feedback?.state ?? "idle";
  item.dataset.selected = state.selectedId === artifactId ? "true" : "false";

  const selectButton = document.createElement("button");
  selectButton.type = "button";
  selectButton.className = "artifact-main";
  selectButton.dataset.action = "select";
  selectButton.dataset.id = artifact.id;
  selectButton.setAttribute("aria-label", `Select ${artifact.name}`);
  selectButton.innerHTML = `
    <span class="slot">${index + 1}</span>
    ${renderMotif(artifact.motif)}
    <span class="artifact-copy">
      <strong>${artifact.name}</strong>
      <small>${artifact.tag}</small>
    </span>
  `;

  const controls = document.createElement("div");
  controls.className = "card-controls";
  controls.innerHTML = `
    <button type="button" data-action="left" data-index="${index}" aria-label="Move ${artifact.name} earlier">&lt;</button>
    <span>${feedback ? feedback.state : "sort"}</span>
    <button type="button" data-action="right" data-index="${index}" aria-label="Move ${artifact.name} later">&gt;</button>
  `;

  item.append(selectButton, controls);
  return item;
}

function renderMotif(motif) {
  const paths = {
    key: '<path d="M21 30h23v5h-5v5h-5v5h-5V35h-8a9 9 0 1 1 0-5Zm-8 2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>',
    compass: '<circle cx="28" cy="28" r="19"/><path d="M31 14 25 31 42 25 31 14Zm-6 17-5 11 11-5"/>',
    lotus: '<path d="M28 43c-10-7-14-15-11-26 8 4 11 11 11 26Z"/><path d="M28 43c10-7 14-15 11-26-8 4-11 11-11 26Z"/><path d="M28 43c-5-9-5-18 0-28 5 10 5 19 0 28Z"/>',
    lantern: '<path d="M18 18h20l4 8-5 21H19l-5-21 4-8Z"/><path d="M22 12h12M21 28h14M23 47h10"/>',
    ticket: '<path d="M13 20h30v9a5 5 0 0 0 0 10v9H13v-9a5 5 0 0 0 0-10v-9Z"/><path d="M24 24v20"/>',
    crown: '<path d="M13 40h30l-3-21-9 10-5-14-5 14-9-10 1 21Z"/><path d="M15 45h26"/>',
    dial: '<circle cx="28" cy="28" r="18"/><path d="M28 15v13l10 7"/><path d="M18 43c2-8 7-13 15-15"/>',
    mask: '<path d="M10 25c6-8 30-8 36 0-1 13-8 19-18 19S11 38 10 25Z"/><path d="M18 29h8M30 29h8M22 37c4 3 8 3 12 0"/>',
    tile: '<path d="M14 14h28v28H14z"/><path d="M14 23h28M14 33h28M23 14v28M33 14v28"/>',
    engine: '<path d="M15 30h8v-8h15v8h5v12H15V30Z"/><circle cx="22" cy="44" r="4"/><circle cx="36" cy="44" r="4"/><path d="M28 22v-8h8"/>',
    drone: '<path d="M22 26h12l5 7-5 7H22l-5-7 5-7Z"/><circle cx="12" cy="18" r="6"/><circle cx="44" cy="18" r="6"/><circle cx="12" cy="48" r="6"/><circle cx="44" cy="48" r="6"/><path d="M18 22 24 28M38 22l-6 6M18 44l6-6M38 44l-6-6"/>',
    lens: '<circle cx="25" cy="25" r="14"/><path d="m35 35 11 11"/><path d="M25 13v24M13 25h24"/>',
    bell: '<path d="M17 40h22l-4-7V23a9 9 0 0 0-18 0v10l-4 7h4Z"/><path d="M23 44a5 5 0 0 0 10 0"/>',
    card: '<path d="M13 16h30v28H13z"/><path d="M18 24h12M18 32h20M18 39h9"/>',
    jar: '<path d="M22 13h12v8l6 8v16H16V29l6-8v-8Z"/><path d="M22 13h12M20 31h16M25 24l6 18"/>',
    vase: '<path d="M21 14h14c-4 9-1 13 5 20-1 9-6 14-12 14s-11-5-12-14c6-7 9-11 5-20Z"/><path d="M22 25c5 4 9 4 14 0"/>',
    pearl: '<circle cx="28" cy="28" r="16"/><path d="M18 28h20M28 18v20"/><path d="M39 13 44 8M42 19h8"/>',
    beacon: '<path d="M24 46h8l5-28H19l5 28Z"/><path d="M17 18h22M22 12h12M14 30c-5-3-5-8 0-11M42 30c5-3 5-8 0-11"/>'
  };
  const path = paths[motif] ?? paths.key;
  return `<span class="artifact-art" aria-hidden="true"><svg viewBox="0 0 56 56" role="img">${path}</svg></span>`;
}

function handleTimelineClick(event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const action = button.dataset.action;
  if (action === "select") {
    selectArtifact(button.dataset.id);
  }
  if (action === "left" || action === "right") {
    const index = Number(button.dataset.index);
    const direction = action === "left" ? -1 : 1;
    const nextIndex = index + direction;
    const nextOrder = moveItem(state.order, index, nextIndex);
    if (nextOrder.join("|") !== state.order.join("|")) {
      state.order = nextOrder;
      state.feedback = [];
      state.moves += 1;
      render();
    }
  }
}

function selectArtifact(artifactId) {
  if (!state.selectedId) {
    state.selectedId = artifactId;
    render();
    return;
  }
  if (state.selectedId === artifactId) {
    state.selectedId = null;
    render();
    return;
  }
  state.order = swapItems(state.order, state.selectedId, artifactId);
  state.selectedId = null;
  state.feedback = [];
  state.moves += 1;
  render();
}

function lockTimeline() {
  const elapsed = Math.round((Date.now() - state.startedAt) / 1000);
  const result = evaluateOrder(currentCase(), state.order, state.moves, elapsed);
  state.feedback = result.feedback;
  if (result.solved) {
    state.results.push({ ...result, caseTitle: currentCase().title });
    resultPanel.innerHTML = `
      <strong>Clean lock: ${result.score} pts.</strong>
      <span>${state.caseIndex + 1 === cases.length ? "All cases rebuilt." : "Next cabinet is ready."}</span>
    `;
    lockButton.disabled = true;
    resetButton.disabled = true;
    render();
    window.setTimeout(() => {
      if (state.caseIndex + 1 === cases.length) {
        finishGame();
      } else {
        startCase(state.caseIndex + 1);
      }
    }, 900);
    return;
  }
  resultPanel.innerHTML = `
    <strong>${result.exact} exact, ${result.near} close.</strong>
    <span>Move the marked cards and lock again.</span>
  `;
  render();
}

function resetCase() {
  state.order = buildInitialOrder(currentCase());
  state.selectedId = null;
  state.moves = 0;
  state.startedAt = Date.now();
  state.feedback = [];
  resultPanel.textContent = "";
  render();
}

function finishGame() {
  const share = buildShareText(state.results);
  const total = state.results.reduce((sum, result) => sum + result.score, 0);
  summary.hidden = false;
  summaryTitle.textContent = `Recovered ${state.results.length} timelines`;
  summaryText.textContent = `Final audit for ${runDate}: ${total} points across ${cases.length} museum cases.`;
  shareText.value = share;
  document.querySelector(".game-layout").hidden = true;
  document.querySelector(".topbar").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function copyShareText() {
  shareText.select();
  try {
    await navigator.clipboard.writeText(shareText.value);
    copyButton.textContent = "Copied";
  } catch {
    copyButton.textContent = "Text selected";
  }
}

function restartGame() {
  state.results = [];
  summary.hidden = true;
  document.querySelector(".game-layout").hidden = false;
  startCase(0);
}

timeline.addEventListener("click", handleTimelineClick);
lockButton.addEventListener("click", lockTimeline);
resetButton.addEventListener("click", resetCase);
copyButton.addEventListener("click", copyShareText);
restartButton.addEventListener("click", restartGame);

startCase(0);

window.timeHeistDebug = {
  cases,
  orderedArtifacts,
  solveCurrentCase() {
    state.order = orderedArtifacts(currentCase()).map((artifact) => artifact.id);
    render();
  }
};
