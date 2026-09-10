# Zaraff — application

## The rule
`src/app` and `src/components` may import **only** from `src/content`.
They must never import a vendor SDK, a vendor type, or an adapter directly.

    UI  ->  content()  ->  ContentSource (port)  ->  adapter  ->  CMS or repo JSON

Swapping the CMS means writing one adapter. It does not mean touching a page.

## Layout
    src/content/
      domain/types.ts       canonical model + Zod schemas. The contract.
      ports/ContentSource.ts the interface every backend implements
      adapters/json/        repo files. Default, and the fallback.
      adapters/contentstack/ delivery API + mappers (anti-corruption layer)
      index.ts              factory, chooses the adapter, wires the fallback
    content/                *.json read by the JSON adapter

## Configuration
    CONTENT_SOURCE=json           # default
    CONTENT_SOURCE=contentstack
    CONTENT_FALLBACK=json         # degrade to repo content if the CMS is down

    CONTENTSTACK_API_KEY=
    CONTENTSTACK_DELIVERY_TOKEN=
    CONTENTSTACK_ENVIRONMENT=
    CONTENTSTACK_REGION=eu        # omit for NA

## Adding a backend
1. `src/content/adapters/<name>/` with a class implementing `ContentSource`
2. A `mappers.ts` that ends every mapper in a schema `.parse()`
3. One case in the `build()` switch in `index.ts`

TypeScript will tell you if the adapter is incomplete. That is the point.

## Caching
Contentstack reads are tagged `content` and `content:<type>`. A CMS webhook
hitting `revalidateTag('content')` invalidates everything without a redeploy —
SSR that behaves like static.

## Checks
    npm run typecheck
    npx tsx smoke.ts     # exercises the port against the active source

## Styling
No CSS framework and no component library — deliberately. A component library's
defaults are exactly the templated look this brand is trying to avoid, and the
site has too few stateful widgets to justify one. Tailwind would duplicate the
token layer that already exists in CSS custom properties.

    src/styles/
      tokens.css      custom properties only. Declares the layer order.
      base.css        element defaults, type ramp, layout utilities
      components.css  buttons, fields, chips, frame
      domain.css      project plate, comparison, packages, facts, dock bar
      index.css       the single import for the root layout

**Layers:** `@layer tokens, base, components, domain`. Later layers win
regardless of specificity. CSS Modules are intentionally *unlayered*, so
page-specific styles beat everything above — the correct precedence.

**Per-page styles:** CSS Modules (`Page.module.css`). Scoped, no collisions,
unused CSS dropped per route.

**Fonts:** `next/font` self-hosts Archivo. Do not reintroduce the Google Fonts
`@import` — it render-blocks and adds a third-party request on every load.

**Icons:** inline SVG, hand-picked. No icon library.

**If we ever need a modal, menu or combobox:** use Radix primitives (unstyled)
rather than hand-rolling focus management. Nothing needs it yet.

**Enforcement:** `npm run lint:css`. Raw hex outside tokens.css is an error, as
is reaching past the spacing ladder. Colours that must ignore the theme — text
over photography — are tokens too (`--on-media`, `--scrim-*`).
