# Legacy Dictionary — Frozen Reference (DEADCODE)

**Status:** Frozen. Not routable. Not maintained. Not imported by active code.

This directory preserves the pre-Guonopedia Dictionary implementation verbatim
for historical/reference purposes. Do not edit, do not import from active code.

## Contents (moved verbatim, structure preserved)

- `components/dictionary/` — 7 legacy components, relocated from
  `src/components/dictionary/`:
  `dictionaryOverview`, `wordDetails`, `addNewWord`, `UploadModal`,
  `TermsConditionsPopup`, `listOfWord`, `welcome`.
- `routes-dictionary/` — 3 legacy route pages, relocated from
  `src/app/(main)/dictionary/` (`page`, `addNewWord/page`,
  `word/[wordId]/page`). They are no longer under `src/app/`, so the old
  `/dictionary` routes return 404. The sole active route is
  `/guonopedia/dictionary` (`src/app/(base)/guonopedia/dictionary/`).
- `lib-api/` — 10 raw-fetch mutation modules retired during the RTK
  migration (`add-review`, `update-word`, `update-sense`,
  `update-translation`, `delete-sense`, `delete-translation`,
  `delete-image`, `delete-audio`, `save-uploaded-image`,
  `save-uploaded-audio`), relocated from `src/features/dictionary/lib/api/`
  after zero-caller verification. Server reads (`fetch-all-words`,
  `fetch-single-word`) remain active and were not moved.
- `contexts-superseded/` — 3 pre-refactor context modules
  (`single-word-context`, `all-words-context`, `add-context`) superseded by
  the feature-owned state restructure (URL-synced view state, focused
  sense/review contexts, renamed wizard context). Preserved verbatim for
  reference; not imported by active code.
- `pos-sample.ts` — retired `sample` dev fixture relocated verbatim from
  `src/features/dictionary/lib/content.ts` (now `lib/pos-options.ts`).
  Zero active importers (verified). Preserved for reference.

## Intentionally NOT moved (frozen in place, still have active consumers)

- `src/slice/dictionaryOverviewSlice.ts` — still wired in `src/store/store.ts`.
- `src/types/fetchWord.ts` — still imported by `src/slice/endpoints/wordEndpoints.ts`.

## Decoupling note

- `src/components/games/games.tsx` previously imported
  `../dictionary/UploadModal`. It now uses a verbatim local copy at
  `src/components/games/UploadModal.tsx`. No active file imports from this
  directory (verified via grep for `_deadcode`).

## Tooling

- Excluded from `tsc --noEmit` via `tsconfig.json` (`exclude`).
- ESLint/Vitest do not discover these files (verified: `next lint` clean,
  direct `npx eslint` clean, `vitest run` unaffected) — no ignores added.
