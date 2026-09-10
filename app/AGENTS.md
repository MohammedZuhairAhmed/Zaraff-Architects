# Zaraff — agent instructions

## Framework
Next.js 16 App Router with **Cache Components enabled**. Read the version-matched
docs bundled at `node_modules/next/dist/docs/` before writing code — they match
the installed version, training data does not. Next 16 has breaking changes from
15 and earlier.

## The architectural rule that matters most
`src/app` and `src/components` may import **only** from `src/content`.
Never a CMS SDK, never a vendor type, never an adapter directly.

    UI  ->  src/content/cached  ->  content()  ->  ContentSource (port)  ->  adapter

Pages read from `@/content/cached`, not from `content()` directly. That module
is where `use cache` / `cacheLife` / `cacheTag` live.

## Caching
Caching is app policy, not an adapter concern — the JSON adapter has no `fetch`
to tag, so adapter-level caching would silently apply to one source and not the
fallback. Every read is a `use cache` scope in `src/content/cached.ts`, tagged
`content` and `content:<type>`. The webhook at `POST /api/revalidate` calls
`revalidateTag(tag, 'max')`.

Do not add `next: { tags }` to fetches in adapters. The cached facade owns it.

## Styling
No CSS framework, no component library — see README.md for why.
`@layer tokens, base, components, domain, pages`. Raw hex outside `tokens.css`
fails `npm run lint:css`. Colours that must ignore the theme (text over
photography) are tokens too: `--on-media`, `--scrim-*`.

Fonts come from `next/font`. Never reintroduce a Google Fonts `@import`.

## Content facts
- Every project needs a `role`. For work delivered under his employer, the
  honest credit protects him and reads as a credential.
- Package `rate` is a string. "On request" is a legitimate value.
- Placeholder figures must not be presented as fact. The draft banner and the
  `noindex` in `layout.tsx` come off only at launch.

## Checks before calling anything done
    npm run typecheck
    npm run lint:css
    npm run build
    npm run smoke
