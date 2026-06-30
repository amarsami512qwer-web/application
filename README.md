# Blockcraft Studio — starter site

A simple, free-to-host portfolio + community site for a beginner 3D artist.

## Pages
- `index.html` — homepage / hero
- `portfolio.html` — demo builds, with YouTube embeds
- `roadmap.html` — 6-stage learning path; logged-in members place their avatar on a stage
- `community.html` — register / log in, and a posts wall
- `profile.html` — a member's own page

## How it works
This is a plain static site (HTML/CSS/JS) — no server, no build step, no cost.
Accounts, posts, and roadmap placement are stored using the browser's
`localStorage`, so it works immediately with zero setup.

**Important limitation:** because there's no real backend, accounts and posts
are saved per-browser, not shared across every visitor's device. Two people on
two different computers won't see each other's accounts. This is fine for a
learning project, a demo, or while it's just you and a few friends testing in
the same browser/profile.

When ready for a real shared community (everyone sees the same accounts and
posts from any device), swap the `localStorage` calls in `app.js` for a free
backend such as Firebase (Auth + Firestore) or Supabase — both have generous
free tiers and plug into static sites like this one easily.

## Deploying for free
Any static host works, for example:
- **Netlify** — drag-and-drop this folder onto netlify.com/drop
- **GitHub Pages** — push this folder to a repo and enable Pages in settings
- **Vercel** — import the folder as a static project

No build command is needed — just publish the folder as-is.

## Customizing
- Edit colors/fonts in `style.css` (`:root` variables at the top)
- Edit the roadmap stages in `app.js` (`BC.STAGES` array)
- Replace footer text / hero copy directly in the HTML files
