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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Runtime verification
`next dev` must be running. Verify changes at runtime, not just via build:

    npx skills add vercel/next.js --skill next-dev-loop   # already installed
    # framework view
    curl -s -X POST http://localhost:3000/_next/mcp -H 'Content-Type: application/json' \
      -H 'Accept: application/json, text/event-stream' \
      -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_errors","arguments":{}}}'
    # browser view
    agent-browser --session "$(agent-browser session id --scope worktree --prefix next-dev-loop)" \
      --restore --headed --enable react-devtools open http://localhost:3000
    agent-browser console
    agent-browser network requests

Read `agent-browser skills get core` before using it — do not guess subcommands.

## Cache gotchas learned the hard way
- `cacheLife('seconds')` is *short-lived*: excluded from prerendering, turns
  cached reads into dynamic holes, and trips blocking-prerender in the layout.
- `stale: 0` keeps content out of the App Shell and trips "uncached data
  during prerendering".
- Next generates one `cacheLife` overload per profile name, so the argument
  must be a **literal at the call site**. A variable holding a union of two
  valid profiles will not typecheck.
- Editing `content/*.json` does nothing until the cache expires. The dev
  profile in `src/content/cached.ts` exists solely so that edit loop works.

## Component layering
    page  ->  collection  ->  item
Pages fetch and compose. Collections own layout and the empty/single-item
cases. Items are presentational and take one domain object.

- A page must never write `grid grid--2`, `zf-packages` or `svc-list`. If a
  page needs a collection laid out, that belongs in `components/collections/`.
- Never hand-roll an item's markup inline. The case study did exactly that for
  project cards and the copy had already drifted from ProjectPlate.
- Collections take shared context (e.g. the WhatsApp number) once and pass it
  down, so pages stop threading site settings through every item.
- Every collection handles zero items with written copy, and collapses to one
  column when it has a single item.

## Variant vs state
Shadow, lift and opacity mean *interaction*. A data variant — a recommended
package, a featured project — gets a marker and words, never the interaction
vocabulary. Conflating them made a static package tier look permanently
selected.



## Debugging the reveal
Append `?vtdebug=1` and open the console. Logs origin, viewport, scrollY,
dock state, radius, which layer animates, and every view-transition animation
the browser is actually running — a UA animation creeping back in is
otherwise invisible.



## The theme reveal clones the page
The circular reveal keeps every component visible, which means the OLD
rendering has to stay on screen while the DOM already carries the new theme.
That needs a copy of the page. View Transitions provides one but was
unreliable across Chrome versions here, so the copy is explicit:

1. clone `document.body`'s children into `.theme-reveal` (scripts skipped)
2. set `data-theme` on that layer to the OUTGOING theme
3. apply the new theme to `:root` — hidden behind the clone
4. grow `--hole` in the layer's radial mask from the bulb
5. remove the layer

Consequences to respect:
- Theme tokens are on `[data-theme='light'] / [data-theme='dark']`, NOT
  `:root[...]`. They must resolve on any element or the clone cannot carry a
  theme.
- `--hole` is a registered `@property`; a plain custom property cannot be
  interpolated and the mask would jump.
- `.theme-reveal` must not get `transform`, `filter` or `will-change`. Any of
  them makes it a containing block and the cloned `position:fixed` dock would
  be mispositioned.
- The clone is `inert`, `aria-hidden`, and has animations and transitions
  disabled so it behaves as a still image.
- The clone container is absolutely positioned, so it does NOT inherit
  body's margin, border or padding the way real flow content does. Offset it
  by all three or every cloned element is misplaced — `body`'s 26px
  padding-top for the draft banner put the whole clone 26px high, and content
  visibly jumped as the hole crossed it. Verify with
  `cloneRect.top - realRect.top === 0` on a flow element AND a fixed one.
