# Time Heist Shuffle

A tiny no-dependency browser game built for the 2026-05-23 daily fun-project run.

Play the public demo: https://bte808.github.io/fun-20260523-a-time-heist/

## What It Is

Time Heist Shuffle is a quick timeline puzzle. A museum time heist has scrambled six fictional artifacts, and the player has to rebuild the order from earliest to latest using clue cards.

## What It Can Do

- Starts instantly in the browser with no login, server API, or build step.
- Presents three compact cases with six artifact cards each.
- Lets the player select two cards to swap, move one card earlier/later, or use arrow keys on the selected card.
- Scores each locked timeline with exact, near, and off-position feedback.
- Freezes a clean lock while the next case opens so repeated taps cannot double-count a timeline.
- Supports replay links with `?seed=...` so two players can open the same shuffled case order.
- Shows the current replay link during play and can copy a public challenge URL before the game is finished.
- Shows a live control hint after swaps, keyboard moves, reset, and lock checks.
- Generates a short result text with the replay seed and URL that can be copied at the end.

## Why It Is Useful

It is a small shareable puzzle format that can be opened from any static host. The game loop is short enough for one break but structured enough to support daily cases later.

## Why It Is Fun

The player gets immediate tactile feedback: cards move, visual artifacts change state, and a locked guess reveals which pieces are close without ending the case. The theme turns a simple ordering puzzle into a tiny museum-heist story.
Seeded replay links make it easier to challenge someone else with the exact same shuffle instead of only sharing a final score.

## Why It Is Worth Starring

- It is a complete static puzzle game that works from a single GitHub Pages URL.
- It has deterministic seeds, so it can be reused as a daily challenge format or a tiny classroom ordering exercise.
- It keeps the implementation small: vanilla JavaScript, no build step, no account system, and smoke tests for the core scoring and replay behavior.

## Inspiration

The direction came from browsing recent public lightweight puzzle surfaces, especially:

- Hacker News Show HN's recent puzzle entries, including offline-first and daily puzzle posts.
- GitHub's recent browser puzzle/game repository search results.

Only the broad format was used. The code, artifact names, clues, scoring, and visual treatment are original for this repo.

## Core Play

1. Read the museum notes.
2. Reorder the six artifact cards from earliest to latest.
3. Lock the timeline.
4. Use exact/near/off feedback to repair the order.
5. Clear all three cases and copy the result.

## Run Locally

```bash
npm start
```

Then open:

```text
http://localhost:5183
```

You can also serve the folder with any static file server.

Replay a specific shuffle by adding a seed:

```text
https://bte808.github.io/fun-20260523-a-time-heist/?seed=museum-night
```

## Validate

```bash
npm test
npm run check
```

## License

MIT

## Possible Extensions

- Add a hard mode that hides near-position feedback.
- Add more daily case files.
- Add a small case editor that exports a new local puzzle pack.
