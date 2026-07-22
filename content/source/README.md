# Source content

These markdown files are the content source of truth for the FAQ and the legal
documents. They are copies of the originals kept in the working folder one level
above the repository; copies live here so the build and CI can read them.

To update any of this content:

1. Edit the markdown file here (or replace it with a fresh copy of the original).
2. Run `npm run content` to regenerate the typed modules under `src/content/`.
3. Commit both the markdown change and the regenerated output.

`npm run content` is deliberately separate from `npm run build` — a parsing
failure should surface as a content error, never as a broken deploy.

| File | Feeds |
| :--- | :--- |
| `Member FAQs.md` | Help Center FAQ list and search index |
| `Privacy Policy.md` | `/legal/privacy` |
| `Cookie Policy.md` | `/legal/cookies` |
| `Terms and Conditions.md` | `/legal/terms` |
| `Click Draw T&C.md` | `/legal/click-draw` and the draw explainer |
| `Level, XP, Badges, Quests rules.md` | Reference for `src/lib/gamification.ts` |

Two notes on the files themselves:

- `Click Draw T&C.md` holds the whole regulation inside a single table cell, with
  `Section N.` markers inline rather than as headings, and ends with a 56 KB
  base64 signature image. The parser splits on the section markers and discards
  the image.
- `Level, XP, Badges, Quests rules.md` is transcribed by hand into
  `src/lib/gamification.ts` rather than parsed, because its rules need to become
  typed functions, not rendered prose.
