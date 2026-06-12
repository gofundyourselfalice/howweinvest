# Image brief — How We Invest

What to commission, the visual style, and exactly where each file should be dropped into the repo.

---

## Visual style — the whole set

**Style:** Single-colour line art. Abstract / geometric. Simple. Anatomy of a New Yorker spot illustration: confident lines, no shading, no gradients.

**Colour:** Match the page background of each chapter (we use tinted backgrounds — see below) so the illustration sits on it naturally. The line itself is the GFY ink colour, `#111111`. If you want a hint of warmth, use a single accent in `#C97A3A` (a warm terracotta we already use in the toggle).

**Size:** Designed to display at around 160–200px wide. SVG (vector) so it scales cleanly. Aim for a square or square-ish aspect ratio, max 320×320 viewBox.

**Tone:** Optimistic, warm, calm. Not "finance bro" stock-image energy. Think: print magazine spot illustration rather than infographic.

---

## Where to put the files

The folder already exists: **`images/illustrations/`**. Drop each SVG in at the filename listed below — the HTML is already wired up to reference it. As soon as the file exists at the path, the placeholder disappears and the illustration appears in its place.

(No HTML changes needed once you drop in the SVGs — but DM me if you want to use PNGs instead, the markup will need a tweak.)

---

## Essential — chapter header illustrations

Each guide chapter opens with a small line-art mark above the title. Five illustrations, one per chapter.

| Chapter | File path | Concept brief |
|---|---|---|
| Ch. 1 — The Why | `images/illustrations/why.svg` | **A seedling growing** — single line, with one tiny leaf. Hints at "starting small," "grows over time," and the chapter's whole "you don't need a lot to start" message. |
| Ch. 2 — The How | `images/illustrations/how.svg` | **Three building blocks** stacked, or a stylised set of nested boxes (ISAs are wrappers, funds inside them, etc.). Could also work as a map / floor plan with five marked steps. |
| Ch. 3 — Staying the Course | `images/illustrations/staying.svg` | **A small rowing boat on a wave** — the wave being the market's ups and downs, the boat steady. Or alternatively an anchor. |
| Ch. 4 — What Comes Next | `images/illustrations/next.svg` | **A compass** with the needle pointing at something off-page, or a sunrise over a horizon line. Sense of "what's beyond." |
| Ch. 5 — Lessons | `images/illustrations/lessons.svg` | **An open book** with a small lightbulb or star above it. Or a lantern. The sense is "things that were learned." |

---

## Essential — concept illustrations inside the guide

Molly's review specifically called out a couple of metaphors that should become illustrations rather than prose:

### The ISA-as-lunchbox

**File path:** `images/illustrations/isa-lunchbox.svg`

**Brief:** A lunchbox, line art. Open, showing simple contents — a coin, a small line chart, a tiny pie chart. The metaphor: the ISA is the box, the investments are the food inside. Sits inline in Chapter 2, Step 1.

**Position in guide:** Inside Step 1 ("Invest tax efficiently — the power of ISAs"), right after the line "Think of it like a lunchbox: the ISA is the box, the funds and shares inside it are the food."

To insert it, find that paragraph in `guide.html` and add right after it:

```html
<div class="chapter-illustration" style="margin: 28px 0;">
  <img src="../images/illustrations/isa-lunchbox.svg" alt="">
</div>
```

(I can wire this in for you once the file exists — just tell me.)

---

## Optional but lovely — ISA-types icons

The visual breakdown of the four ISA types already works as a CSS-based grid with simple character icons (£, ↑, +, ✦). It looks fine. But Molly referenced the IG.com style where each ISA type has its own little illustration.

If you do commission these, four little spot icons:

| Type | File path |
|---|---|
| Cash ISA | `images/illustrations/isa-cash.svg` (stack of coins) |
| Stocks &amp; Shares ISA | `images/illustrations/isa-stocks.svg` (small ascending bar chart) |
| Lifetime ISA | `images/illustrations/isa-lisa.svg` (small house) |
| Junior ISA | `images/illustrations/isa-junior.svg` (a balloon, a kite, something child-feeling) |

These would slot into the existing `.isa-type-icon` spans, replacing the typographic characters.

---

## Optional — homepage hero mark

The homepage doesn't currently have an illustration, just the typographic hero. If you want one — a single mark that becomes a recognisable logo for the project:

**File path:** `images/illustrations/hero-mark.svg`

**Brief:** Something abstract, single-line, that captures "people building something together." A web of connected dots. A circle of small figures. The number 500 stylised into a wave. Up to you.

**Position:** Top of `index.html` hero, just above the eyebrow. Currently feels minimalist enough that a mark could help give it identity.

---

## What I built without needing images

These were on Molly's list but I implemented them as code so you don't need to commission anything:

- **Inflation visualiser** (£1,000 in cash vs invested) — built as an interactive SVG chart in `tools.js`, lives in Ch. 1.
- **Should I invest? flowchart** — built as a 4-question clickthrough quiz in `tools.js`, lives in Ch. 1.
- **Compound interest calculator** — built as a 3-slider interactive tool with a stacked bar chart, lives in Ch. 2 Step 3.
- **Lump sum vs PCA toggle** — built as a side-by-side line chart with a Both/Lump/PCA toggle, lives in Ch. 2 Step 4.
- **All the missing charts** (starting age, what people avoid, biggest mistakes, monthly amounts, funds vs stocks) — built as CSS bar charts using the existing `.chart` style, restored to the guide.

These all use the same visual language as the rest of the site. They'll look right alongside whatever illustration style you settle on.

---

## How to drop the files in

Once you have the SVGs:

1. Open the project folder (Finder → GFY Investing Guide).
2. Open the `images/illustrations` subfolder.
3. Drag each SVG in, matching the exact filename from the tables above.
4. Open `guide.html` (or any page) in your browser and refresh — the illustrations will show automatically.
5. When you're happy, push via GitHub Desktop as normal.

That's it. The placeholders are designed to disappear as soon as the real file shows up at the right path.

---

# Platform logos — the providers page

The new `/hub/providers` page shows 11 platform cards. Each card has a square logo slot at the top-left. Until you drop in a logo file, the slot shows a text monogram (HL, T212, V, etc.) — so the page works today and gets prettier as logos arrive.

## Where to put them

The folder already exists: **`images/logos/`**. Each logo file must match the exact filename below. The HTML is wired so as soon as the file exists at the path, the monogram disappears and the real logo appears.

## How to source them

These are existing platform brands — don't draw new logos, use each company's official brand asset:

1. Go to each platform's website.
2. Look in the footer for a "Brand," "Press," "Media kit," or "Brand assets" link. Most fintech and finance platforms publish their brand assets at e.g. `[platform.com]/brand` or `[platform.com]/press`.
3. Download their official **SVG or PNG logo** (SVG is preferred — scales cleanly).
4. If their brand guidelines provide both a wordmark and a symbol/monogram, **the symbol/monogram works best** in our 52×52px box. If only a wordmark is available, that's fine.
5. Rename the file to match the path in the table below and drop it into `images/logos/`.

## File list (in order they appear on the providers page)

### Most popular DIY platforms

| Platform | File path | Brand asset source |
|---|---|---|
| Hargreaves Lansdown | `images/logos/hargreaves-lansdown.svg` | hl.co.uk → footer → "Press" |
| Trading 212 | `images/logos/trading-212.svg` | trading212.com → "Press" / brand pack |
| Vanguard | `images/logos/vanguard.svg` | vanguardinvestor.co.uk |

### Also mentioned regularly (DIY)

| Platform | File path | Brand asset source |
|---|---|---|
| AJ Bell | `images/logos/aj-bell.svg` | ajbell.co.uk |
| Fidelity | `images/logos/fidelity.svg` | fidelity.co.uk |
| Freetrade | `images/logos/freetrade.svg` | freetrade.io |
| Interactive Investor | `images/logos/interactive-investor.svg` | ii.co.uk |
| Plum | `images/logos/plum.svg` | withplum.com |

### Most popular robo advisers

| Platform | File path | Brand asset source |
|---|---|---|
| Moneybox | `images/logos/moneybox.svg` | moneyboxapp.com |
| Nutmeg / JP Morgan | `images/logos/nutmeg.svg` | nutmeg.com |
| Wealthify | `images/logos/wealthify.svg` | wealthify.com |

### Supporters

| Platform | File path | Brand asset source |
|---|---|---|
| XTB | `images/logos/xtb.svg` | xtb.com -> press / brand assets |
| eToro | `images/logos/etoro.svg` | etoro.com -> press room / media kit |

## If a platform won't share an SVG

PNGs work too — just rename the file with a `.png` extension and the HTML `<img>` tag will load it the same way. If you want me to swap any specific file extension, tell me which one.

## Legal / brand-safety note

Using a company's official logo to identify their product (which is what we're doing here) generally falls under nominative fair use — it's the same way price-comparison sites use Visa/Mastercard logos. You're not endorsing them, and they're not endorsing you. Stick to each brand's official assets at their official aspect ratio / colours — don't redraw them — and you're fine.

If any platform's brand team specifically asks you to use their logo a particular way (only on a certain background, with a minimum size, etc.), follow that and we can adjust the slot styling.

## How to drop the logo files in

Same as the illustrations:

1. Open `images/logos` in Finder.
2. Drag each file in, matching the filenames above.
3. Refresh `hub/providers.html` in your browser — the text monograms disappear, the real logos appear.
4. Push via GitHub Desktop as normal.
