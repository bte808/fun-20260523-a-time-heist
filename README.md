# Time Heist Shuffle

A tiny no-dependency browser game built for the 2026-05-23 daily fun-project run.

## What It Is

Time Heist Shuffle is a quick timeline puzzle. A museum time heist has scrambled six fictional artifacts, and the player has to rebuild the order from earliest to latest using clue cards.

## What It Can Do

- Starts instantly in the browser with no login, server API, or build step.
- Presents three compact cases with six artifact cards each.
- Lets the player select two cards to swap, or move one card earlier/later.
- Scores each locked timeline with exact, near, and off-position feedback.
- Freezes a clean lock while the next case opens so repeated taps cannot double-count a timeline.
- Generates a short result text that can be copied at the end.

## Why It Is Useful

It is a small shareable puzzle format that can be opened from any static host. The game loop is short enough for one break but structured enough to support daily cases later.

## Why It Is Fun

The player gets immediate tactile feedback: cards move, visual artifacts change state, and a locked guess reveals which pieces are close without ending the case. The theme turns a simple ordering puzzle into a tiny museum-heist story.

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

## Validate

```bash
npm test
npm run check
```

## License

MIT

## Possible Extensions

- Add a daily seeded case generator.
- Add keyboard shortcuts for moving the selected card.
- Add a hard mode that hides near-position feedback.
- Publish to GitHub Pages.
