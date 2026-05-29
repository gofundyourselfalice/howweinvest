# How We Invest — GFY community guide

A microsite by [Go Fund Yourself](https://www.instagram.com/gofundyourself) built from 500+ anonymous Instagram Story responses about how real people in the UK actually invest.

Live site: _(Netlify URL goes here once connected)_

---

## Site architecture

Two main parts: a single-page **guide** (a long-scroll journey through the investing story) and a multi-page **community hub** (a reference resource people return to repeatedly).

```
/                       Minimal homepage — intro + two entry points
/guide                  THE guide — one-page scroller
  #introduction
  #the-why              Chapter 1
  #the-how              Chapter 2 (the five practical steps)
  #staying-the-course   Chapter 3
  #what-comes-next      Chapter 4
  #lessons              Chapter 5

/hub                    Community Hub landing
  /hub/videos           How-to walkthroughs (categorised)
  /hub/stories          Case studies
  /hub/providers        Platform comparison + affiliate links
  /hub/glossary         Searchable glossary (every term has its own anchor)
  /hub/questions        Community Q&A forum (coming)

/submit                 Share-your-story form (Tally embed)
```

The guide is the editorial heart. The hub is the reference. Provider/affiliate content lives in the hub to keep the guide's editorial credibility intact.

## Files

- `index.html` — homepage
- `guide.html` — the one-page scroller with all five chapters
- `submit.html` — Tally form embed
- `hub/index.html` — hub landing page
- `hub/videos.html`, `hub/stories.html`, `hub/providers.html`, `hub/glossary.html`, `hub/questions.html` — hub sub-pages
- `styles.css` — all styling, shared across every page
- `netlify.toml` — Netlify config (deploy settings + pretty URL redirects)
- `TALLY_FORM_SPEC.md` — spec for the Tally submission form

## How to preview locally

Open any `.html` file in a browser. For a proper preview with working navigation:

```
cd "GFY Investing Guide"
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## How to edit

Use your Claude desktop app with this folder connected. Tell Claude what you want to change in plain English — it'll edit the right files. Preview in the browser to see results.

## How changes go live

Every commit to the `main` branch auto-deploys to Netlify within ~30 seconds. Pull Requests get their own preview URL so changes can be reviewed as a live site before merging.

## Editors

- Alice Tapper (project owner)
- Molly _(co-editor — site structure & content)_
