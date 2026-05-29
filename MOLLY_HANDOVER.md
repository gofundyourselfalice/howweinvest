# How We Invest — handover for Molly

Hi Molly,

This is the GFY community investing guide — a microsite built from the 500+ anonymous Instagram Story responses we collected in March 2026. You wrote most of the actual copy; I'd love your eyes on whether it hangs together as a *site* before we make it public.

## What's there

A homepage and seven content pages, each one a chapter or section of the guide. They're all linked together by a top navigation. The live preview will be at a Netlify URL — Alice will send it once it's connected. You can also open any `.html` file in the project folder by double-clicking it.

The full file map is in `README.md` if you want it.

## What I'd love you to look at

This isn't a copy-edit pass — it's about the site, not the prose. Specifically:

1. **The menu.** Right items, right order? Should "Choose your platform" be in the top nav, or is it fine that it's only linked from the homepage?
2. **The homepage.** Right hierarchy? Too much before the chapter cards? Is the right CTA leading?
3. **Length per page.** Is `the-how.html` too long? Should the five steps be five pages? Anything else worth splitting or merging?
4. **Flow between pages.** Does each chapter push you to the next one? Are the CTAs and "next" links in the right places?
5. **What goes where.** Anything in the wrong chapter? Anything duplicated? Anything that should live in the Community Hub but is buried in a chapter?
6. **Community Hub.** Right things to host there? Right position in the nav?
7. **Submit page.** Is "Share your story" prominent enough?

Restructure freely — move pages around, change the nav, split or merge chapters. If you want to propose a change but not commit to it, just leave an HTML comment in the file (`<!-- Molly: should this be split? -->`) and I'll see it.

## How to access and edit it

The project lives in a GitHub repo. You'll get an email invite from GitHub from Alice — accept that first. Then:

1. **Open Claude desktop** and create a new project (or use an existing one).
2. **Tell Claude:** *"Connect to the GitHub repo `[repo-name-Alice-will-send]` and clone it locally."* Claude will set everything up.
3. **At the start of each session,** say *"pull the latest changes."* This grabs anything Alice has added since you were last in.
4. **Edit by chatting,** e.g. *"open the-how.html and tell me what you think of the structure"* or *"split the-how into two pages — one for ISAs and one for platforms."*
5. **To preview your changes,** say *"start a preview."* Claude opens the live rendered site in your browser. Refresh after edits.
6. **When you're done,** say *"save my changes and send them to Alice for review."* Claude creates a Pull Request. Alice gets a notification, sees exactly what you changed (and a live preview URL of your version of the site), comments or approves, and merges.

That's it. You'll never see a line of code unless you want to. Claude describes everything in English and shows you the rendered site, not the HTML.

## One small thing to know

If we're both in the same file at the same time, GitHub will surface it as a "merge conflict" and Claude will help resolve it — nothing gets lost. But it's friendlier to give each other a quick heads-up if you know you're about to dig into the same chapter.

Anything that confuses you — just ask your Claude. It can answer "what does Alice's latest PR change?" or "how do I undo my last edit?" or "is this site live yet?" in plain English.

Thank you so much for doing this.

Alice x
