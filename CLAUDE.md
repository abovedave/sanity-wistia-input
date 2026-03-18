# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project is a Sanity v5 plugin, you can find their docs here:

https://www.sanity.io/docs/llms-full.txt

You can also find Wistia's API documentation here:

https://docs.wistia.com/llms.txt

## Commands

```bash
npm run build       # type-check, verify, and compile to dist/
npm run watch       # rebuild on file changes
npm run lint        # eslint
npm run format      # prettier
npm run link-watch  # publish locally via yalc for testing in a Studio
```

There are no tests. To test changes, use `npm run link-watch` with a local Sanity Studio that has the plugin installed via yalc.

## Architecture

The plugin registers a single Sanity object type (`wistiaMedia`) with a custom input component and preview component. The entry point is `src/index.ts`, which wires everything together via `definePlugin`.

**Data flow:**

- `src/schema.tsx` — defines the `wistiaMedia` object type (`id: number`, `hashed_id: string`). The `prepare` function in `preview` converts the numeric `id` to a string to avoid Sanity calling `.toLowerCase()` on it.
- `src/plugin.tsx` — exports `wistiaMediaRender(config)` which returns the `components` object (`input`, `preview`) injected into the schema type at registration.
- `src/index.ts` — merges schema + components + any user-supplied `config.fields` into the final registered type.

**Component roles:**

- `Input.tsx` — shown in edit mode. Manages picker dialog state. Returns the active state element as the root node (no fragment wrapper) so Sanity's parent container styles (`height: 100%`) apply correctly. The `Dialog` is rendered as a child of each state branch — it uses portals internally so it renders at `<body>` level regardless.
- `Preview.tsx` — shown in block/list view mode. Renders `renderDefault` (title/subtitle) plus an iframe embed when a `hashed_id` is present.
- `Folder.tsx` — project/folder list inside the picker dialog. Calls `GET /v1/projects.json`.
- `Medias.tsx` — media list for a selected project. Calls `GET /v1/medias.json?project_id=`. Groups results by `section` for sticky section headers.
- `Player.tsx` — iframe embed wrapper with 16:9 aspect ratio.

**Wistia terminology:** The API calls them "projects"; the Wistia UI calls them "folders". Admin URLs use `/folders/{hashed_id}`.

**Local testing:** The `.yalc/` directory contains a locally published copy of the package for use with `yalc`. Do not edit files there directly.
