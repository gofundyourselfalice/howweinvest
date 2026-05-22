# How We Invest — handover for Molly

Hi Molly,

This is the GFY community investing guide — a microsite built from the 500+ anonymous Instagram Story responses we collected in March 2026. I'd love your eyes on it before it goes live. Below is where the project is, how to get editing access, and what would be most useful from you.

---

## Where we've got to

The microsite is fully drafted. It's a set of plain HTML/CSS files (no fancy framework, no build step) — you can preview any page by double-clicking it and it'll open in your browser.

**Structure of the site:**

- `index.html` — the homepage, with intro, stat strip, and links to every chapter
- `the-why.html` — Chapter 1: why investing matters, when you're ready, what people invest for
- `the-how.html` — Chapter 2: the five-step "how" (ISAs, funds, what to buy, how much, platforms)
- `providers.html` — the platform hub, with affiliate sign-up offers where we have them
- `staying-the-course.html` — Chapter 3: handling dips, how often to check in
- `lessons.html` — Chapter 4: mistakes, what we'd tell our younger selves, trusted info sources
- `what-comes-next.html` — for people who've been investing a while (rebalancing, beyond the ISA, etc.)
- `community-hub.html` — the "living" section: how-tos, case studies, glossary, community Qs
- `submit.html` — the page where readers can add their own story (the Tally form goes here)
- `styles.css` — all the styling. Used by every page.
- `how-we-invest-single-page.html` — the original single-page version. Probably retire this once the multi-page is live.

**Other files in the folder:**

- `TALLY_FORM_SPEC.md` — the question-by-question spec for the Tally submission form. Built but not yet live.
- `instagram_story_responses_anonymised.numbers` — the raw anonymised dataset every quote and number comes from.

**What's done:** every chapter is drafted, the visual design is locked, the navigation works, the disclaimers and affiliate-link transparency are in place, and the submission flow is scaffolded.

**What's still TBD (don't worry about these — I'll handle them):**

- Building the Tally form itself (the spec is written; just needs setting up in Tally)
- Connecting Tally → Notion for the submissions database
- Picking a domain and hosting the site
- Outreach to the top 10 providers for affiliate links and sign-up offers

---

## What I'd love your eyes on

You wrote most of the actual content, so this isn't a copy-edit pass — it's about whether the site itself is structured the right way. The question is: when a stranger lands on the homepage, does this hang together as a *site* and lead them through it well? Specifically:

1. **The menu.** Right now the nav holds: Ch.1 The Why, Ch.2 The How, Ch.3 Staying the Course, Ch.4 Lessons, What Comes Next, Community Hub — plus a "Share your story" CTA. Is that the right set of items, in the right order? Should `providers.html` (Choose your platform) be in the top nav too, or is it fine that it's only linked from the homepage and inside chapters? Anything missing?
2. **The homepage.** What should actually live on `index.html`? Right now it's: intro paragraph, stat strip (500+ replied, 1,400 answers, etc.), "what this guide is and isn't", affiliate-link note, full disclaimer, then a card grid linking to every chapter. Is that the right hierarchy? Too much before the chapter cards? Should there be a clearer one-line CTA at the top — "Read the guide" vs. "Share your story"?
3. **Length per page.** Open each chapter and ask: is this the right length? Anything that should be split into two pages, or merged with another, or cut down hard? `the-how.html` is the longest (~22kb) — does it need to be one page or should the five steps each be their own page?
4. **Flow between pages.** Does each chapter end in a way that pushes the reader to the next one? Are the "next" links and CTAs in the right places? If someone reads The Why, do they naturally end up at The How?
5. **What goes where.** Is anything in the wrong chapter? Anything duplicated across chapters that should only live in one place? Anything that belongs in the Community Hub but is currently buried in a chapter (or vice versa)?
6. **The Community Hub.** This is the "living" section — how-tos, case studies, glossary, community questions. Is that the right set of things to host there, and is it positioned correctly in the site (currently last item in the nav)?
7. **Submit page placement.** The "Share your story" CTA is in the top-right of every page. Is that prominent enough, or should there also be a clear in-line CTA at the end of each chapter?

Feel free to restructure directly — move pages around, change the nav, split or merge chapters, rewrite the homepage layout. If you want to propose a change but not commit to it, leave an HTML comment in the file (`<!-- Molly: should this be split into two pages? -->`) and I'll see it next time I'm in there.

---

## How to get editing access (step by step)

The files live in a Google Drive folder that Alice will share with you. To edit them through your Claude, you need to sync the folder to your Mac and point Claude at it.

**Step 1 — Accept the Google Drive share.**
Alice will share a folder called **GFY Investing Guide** with your Google account. Open the email invite, click the folder, and accept. (Or open Google Drive in your browser → "Shared with me" → right-click the folder → "Add shortcut to Drive" → put it in My Drive.)

**Step 2 — Install Google Drive Desktop (if you don't have it).**
Download from [google.com/drive/download](https://www.google.com/drive/download). Install, sign in with the same Google account Alice shared the folder with. This puts a "Google Drive" folder in your Finder.

**Step 3 — Make sure the folder is available offline.**
In Finder, find the GFY Investing Guide folder inside your Google Drive. Right-click → **"Available offline"**. This makes sure the files actually sync to your hard disk (rather than streaming on demand) — Claude needs them locally to read and edit.

**Step 4 — Open Claude desktop and create a new project.**
In your Claude desktop app, create a new Cowork project (or open an existing one). When it asks which folder to connect, pick the synced **GFY Investing Guide** folder from your local Drive path. It'll be somewhere like:

```
/Users/yourname/Library/CloudStorage/GoogleDrive-yourname@email.com/My Drive/GFY Investing Guide
```

**Step 5 — Confirm Claude can see the files.**
Once the project is set up, ask Claude something like *"list the files in this project"* — you should see all the .html files, styles.css, this handover doc, and the Tally spec. If you do, you're good.

---

## How to edit the site with Claude

Some prompts that work well:

- *"Open `the-why.html` and tighten the opening section — make it warmer."*
- *"In `the-how.html`, the third paragraph of Step 2 feels jargon-y. Rewrite for someone who's never invested before."*
- *"Find every mention of 'compound interest' across the whole site and check it's explained consistently."*
- *"I want to add a new section to `lessons.html` about... [whatever]. Draft it in the same voice as the rest of the chapter."*

Claude will edit the files directly. To preview your changes:

- **Quick preview:** double-click any .html file in Finder — it opens in your browser. Hit refresh after Claude edits.
- **Better preview (sees all pages with working navigation):** ask Claude *"start a local web server in this folder"* — it'll give you a URL like `http://localhost:8000` you can open in your browser and click through the whole site as readers will see it.

---

## One important thing to watch — sync conflicts

Because the folder is shared via Google Drive, if Alice and I both edit the same file at the same time, Drive will save a "conflicted copy" and one set of changes will get stranded.

Easy rule: **before you sit down to edit, message Alice and check she's not in the same file.** If you're editing `the-how.html`, just give her a heads up. Same the other way round. Drive handles different files fine — it's only the same file simultaneously that's a problem.

---

## Anything else

- Don't worry about breaking the styling — `styles.css` controls all the design and is shared across every page. If you want a visual change anywhere, just describe it and Claude will do the CSS. You don't need to touch the CSS yourself.
- If a chapter feels too long, it probably is. Cut freely.
- If you spot a bug (link doesn't work, image missing, formatting weird), just ask Claude to fix it.
- Anything you're unsure on, leave the HTML comment note and I'll see it next time I'm in the file.

Thank you for doing this — the guide is so much better when it's been through someone else's eyes.

Alice x
