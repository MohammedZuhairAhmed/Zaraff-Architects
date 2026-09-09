# Zaraff — Architects & Interiors

Design system for a design-and-build studio in India. Monochrome by necessity — the brand marks are pure black and white — with exactly one accent, red oxide `#8C2F22`, used scarcely. The page's job is to get a client to send a WhatsApp message.

Source of truth: `DESIGN.md`. Tokens: `styles.css`. Component CSS: `components.css`.

## Foundations

- **Colour** — near-black canvas, white type, a grey ladder, one accent. WhatsApp green appears at most once per view.
- **Type scale** — a single grotesque, Archivo, at sharply contrasted sizes. Display weights stay modest. Sentence case everywhere.
- **Spacing & geometry** — one ladder, a 56px gutter, 2px radius on buttons and chips, 0 elsewhere, full round on status dots only.
- **Contrast check** — measured ratios for every pair the system uses, on both near-black and the `#F4F3F0` light band.

The hairline rectangle from the wordmark lockup is the connective device, defined as tokens (`--frame`, `--frame-width`, `--frame-color`, `--frame-inset`) with `.zf-frame`, `.zf-frame-inset` and `.zf-rule` utilities.

## Components

- **Button** — primary (red oxide), whatsapp (green, with the message mark), secondary (hairline outline); hover, focus-visible and disabled on both grounds.
- **TextLink** — inline link, underlined at rest, red oxide on hover.
- **Input** — single baseline rule, no box; label, hint, error, disabled.
- **Select** — the native control on the same baseline, rotated-square caret.
- **Rule** — the frame device reduced to one hairline edge.
- **StatusChip** — coloured dot plus a sentence-case label; ongoing and completed, plated or bare.
- **Frame** — the wordmark rectangle as a container; bare, inset, elevated.

## Domain

Specific to a studio that designs and builds houses.

- **ProjectPlate** (+ **ProjectMedia**) — the work-index plate. Full-bleed image in the hairline frame, status chip overlaid, then title, typology, area in sqft, location and year. Two densities, featured and index. `ProjectMedia` handles the three kinds of material a project actually has: `render`, `photo`, `drawing` (contained on light, never cropped).
- **ComparisonHero** — the signature component. Enscape render against the finished photograph, split by a draggable divider; a real slider for keyboard, and an automatic before/after toggle on coarse narrow pointers and under reduced motion.
- **PackageTier** / **PackageComparison** — two tiers line by line: name, basis, includes, excludes, and a wa.me action with the tier name pre-filled. Stacks in reading order on a phone rather than becoming a scrolling matrix.
- **FactTable** — location, year, status, area, typology, credits, plus appended rows.
- **WhatsAppBar** / **WhatsAppBarSpacer** — persistent bar on small screens, padded for the safe-area inset; the spacer reserves its height so it never covers the last block.

## Conventions an implementer must hold

- **Two red tokens, one hue.** `--primary` #8C2F22 is the accent. `--primary-lifted` #CF7663 is that same hue raised in lightness, for accent-coloured *type on near-black* only — the oxide itself measures 2.3:1 there. Nothing else coloured may be added.
- **Borders split in two.** `--hairline` is the brand's drawn frame and sits at the edge of visibility by design; it never carries meaning alone. Control edges — buttons, field baselines, toggles — use `--control-border`, which clears 3:1.
- **44px floor.** `.zf-btn` carries `min-height:44px`; so does the comparison toggle. Any new control does the same.
- **`--muted` is not a body colour on dark.** It measures 3.6:1 on #0E0E0D, so it is for large type or the light band. Body copy on dark is `--body`.
- **The WhatsApp label never drops below 16px / 500.** Green with white is 3.1:1, which only holds at that size.
- **Every plate survives missing material** — no image, no metadata, an over-long title.

Not built yet: navigation, the build-process sequence, section headers, footer.
