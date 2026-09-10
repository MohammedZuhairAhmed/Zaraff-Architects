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
