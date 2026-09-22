# VOOM design system — what changed

This is your `lpr-3` project with the mockup's design applied across the
whole app. Drop-in replacement for your working copy.

```bash
npm install
npm run dev
```

No new dependencies. The fonts come from `next/font/google`, which ships
with Next — the first `dev`/`build` needs internet access to fetch them.

---

## 1. Design tokens — `app/globals.css`

One palette instead of four competing blues. Every colour is a CSS
variable with a light and a dark (navy) value, so dark mode is automatic
and a future palette change is a one-line edit.

| Token | Light | Dark |
|---|---|---|
| `--brand` | `#0FA5EE` | `#38BDF8` |
| `--ink` (hero card, active tab) | `#16283F` | `#16293F` |
| `--background` | `#EDF2F8` | `#0B1727` |
| `--card` | `#FFFFFF` | `#0F2035` |
| `--ok` / `--warn` / `--danger` | `#10B981` / `#F59E0B` / `#F43F5E` | lightened |

Tailwind utilities `bg-brand`, `text-brand`, `bg-ink`, `bg-card`,
`text-muted-foreground`, `border-border`, `bg-danger-soft`, `text-ok` …
all resolve to these.

Component classes are also defined here: `voom-card`, `voom-stat`,
`voom-tab`, `voom-input`, `voom-btn`, `voom-table`, `voom-chip`,
`voom-mono`, `voom-pagination`.

## 2. Fonts — `app/layout.tsx`

The project had no `next/font` at all; it was rendering in the browser
default. Now:

- **Plus Jakarta Sans** — headings, labels, body
- **JetBrains Mono** — IPs, URLs, ports, timestamps, table headers,
  pagination. This is what makes the mockup look like the mockup.
- **IBM Plex Sans Arabic** — chained after Jakarta, because Jakarta has
  no Arabic glyphs and the plate letters (ا ب خ) would otherwise fall
  back to a system face.

## 3. Shared primitives — `shared/ui/voom/index.tsx` (new)

`SectionCard`, `StatCard`, `StatRow`, `PillTabs`, `Toolbar`, `Chip`,
`StatusChip`, `Mono`, `CellTitle`, `Pagination`, `CrudShell`, plus the
`LPR_TABS` / `QR_TABS` / `REPORT_TABS` tab sets.

`StatusChip` maps this system's vocabulary — ENTRY, EXIT, ALLOWED,
NOT ALLOWED, PENDING, BLOCKED, ONLINE, OFFLINE, DEGRADED, SUPERADMIN,
ADMIN, MANAGER, SECURITY, IT, OWNER, TENANT, PLATE, QR — to a colour, so
tables stop hand-picking. Add new values to `TONE_BY_STATUS`.

`CrudShell` is the page shape every module shares: tabs → stats →
card{toolbar, table, pagination}.

## 4. Tables — `components/ui/table.tsx`

Restyled the shared shadcn primitive rather than each table, so all ten
tables picked up the mockup's uppercase mono headers and row styling at
once. It also carried a `text-2xl` default, which is why table text was
oversized everywhere.

## 5. Applied across the app

Two codemods, ~2,100 substitutions over 77 files:

- Four hardcoded blues (`sky-500` ×61, `cyan-500` ×29, `blue-500` ×24,
  plus 400/600 variants) collapsed onto `brand`.
- Slate greys → `foreground` / `muted-foreground` / `border` / `secondary`.
- 56 files were written against an older dark glassmorphism theme
  (`bg-[#0f172a]`, `border-white/10`, `bg-white/5`). Those surfaces became
  tokens, and their `text-white` became `text-foreground` — on the new
  light cards, white text would have been invisible.

`text-white` was deliberately left alone everywhere else: it sits on the
navy hero card and brand buttons, where a flipping token would invert it
in dark mode.

Modules rewritten onto `CrudShell`: gates, cameras, readers, plates,
users, departments.

---

## Bugs found and fixed along the way

1. **Gates rendered two headers.** `GatesHeader.tsx` was a near-duplicate
   of `shared/layout/Topbar.tsx`, and `AppLayout` already renders
   `Topbar`. Deleted.
2. **Gates was double-indented.** `GatesPage` re-applied the sidebar
   offset (`lg:ml-[128px]`) on top of `AppLayout`'s `lg:pl-[144px]`.
3. **Gates could not render at all.** It imported `GatesTable` from
   `modules/resident-portal/components`, whose props are a different
   shape entirely (`GateData`, drag handlers, congestion levels). Replaced
   with a real `GatesTable` in the gates module.
4. **Pagination sliced nothing** in gates — every row rendered on every
   page regardless of `currentPage`.

Deleted as now-redundant: `GatesHeader`, `GateStats`, `GatesTabs`,
`GateToolbar`, `GatesPagination`.

---

## Known: 45 pre-existing type errors

`npm run dev` works. `npm run build` does not, and did not before this
change either — your original repo has 49 type errors; this folder has
45 (the 4 fixed ones are the Gates import above). None are from the
design work. They are separate bugs:

- `@/services/owner` and `@/services/gate-entry` don't exist
- `adminRegister`, `updateResidentCredentials`, `GateEntriesTable`,
  `GateEntry` are referenced but never defined
- `CameraFormData.port` is `string` while the service expects `number`
- `Gate.desc` vs `Gate.description`, and `GateFormData.descriptipn`
  (typo) vs `description`
- `User` is declared in `modules/types/user.ts` but not exported
- `Resident.plate_numbers` and `phone_number` missing from the type
- `initialFocus` was removed in react-day-picker v10

Happy to work through these next — say the word.

## Still on the old styling

- `modules/lpr/components/new/*` — looks like an older parallel copy of
  Sidebar / Header / tables. Check whether it's still routed to; several
  of the type errors above live here.
- `modules/resident-portal/*` — the resident-facing portal, a different
  layout from the admin dashboard.
- Forms and modals (`*Form.tsx`, `GateModal`) — they work and now use the
  token colours, but they aren't rebuilt on the shared primitives.

## Sidebar and Topbar

Left structurally alone — they already matched the mockup closely. They
picked up the new palette through the codemod.

---

# Dark / light mode — audit pass

Both modes are defined at the token layer, so any component using
`bg-card`, `text-foreground`, `border-border` etc. flips automatically.
The toggle in `Topbar.tsx` drives `next-themes` with `attribute="class"`,
and `globals.css` declares `@custom-variant dark (&:is(.dark *))`.

`defaultTheme` is `light` and `enableSystem` is `false` — the app ignores
the OS preference and always opens in light. Change in `app/layout.tsx`
if you'd rather follow the system.

## Problems found in this pass and fixed

1. **Routed dashboard pages forced a dark background.** `app/dashboard/page.tsx`,
   `users`, `lpr/plates`, `lpr/cameras`, `residents`, `qr/*` and several
   forms had hardcoded `bg-[#020617]` / `bg-[#0b1120]` / `bg-[#050a18]`
   panels. Light mode was dark navy on those pages regardless of the
   toggle. 40 occurrences → `bg-card` / `bg-background`.

2. **I shrank 60 headings.** My first pass mapped `text-2xl` → `text-sm`
   to fix oversized table text, but it hit `<h1>`/`<h2>`/`<h3>` too.
   Restored to `text-2xl` / `text-xl` / `text-lg`.

3. **Two white-on-white headings.** "QR Codes" and "Gate Entries" were
   `text-white` on a surface that is now white in light mode.

4. **Primary button contrast in dark mode.** `voom-btn--primary` was
   white text on the light-blue dark gradient (~2:1). Now uses
   `--primary-foreground`, which is white in light and dark navy in dark.

## Deliberately left non-flipping

- `#0057A8` in `PlateForm.tsx` — the Egyptian licence-plate blue. It's a
  real-world object, it should not change with the theme.
- `text-white` on `bg-ink` and `bg-brand` fills (Topbar avatar, GateModal
  and ResidentTable buttons) — those surfaces are dark in both modes.
- `modules/resident-portal/*`, `app/page.tsx`, `app/owner/page.tsx` — the
  resident-facing portal is a separate, intentionally dark product
  surface, not part of the admin mockup.

## Not verified

I have not run this in a browser. The audit above is static analysis:
grepping for colours that can't flip, headings that lost their size, and
text whose contrast breaks in one mode. Worth clicking through both modes
once — particularly the forms and modals, which use the new tokens but
were not rebuilt on the shared primitives.

## Dead code

`modules/lpr/components/new/*` (Header, Sidebar, GateTable, PlatesTable,
ResidentsTable, CameraTable, UsersTable, ThemeProvider) is not imported
from anywhere. It looks like an older parallel copy of the layout, and it
accounts for several of the 45 type errors. Safe to delete once you've
confirmed.
