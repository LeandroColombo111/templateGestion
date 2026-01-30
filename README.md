# Anti-Phishing Lab (Static Demo)

Public-repo safe, 100% static demo for GitHub Pages. No backend, no database, no credentials required.

## Demo login
- Admin: `admin@demo.local` / `demo1234`
- Analyst: `analyst@demo.local` / `demo1234`

## Local development
```bash
npm install
npm run dev
```

## GitHub Pages build
```bash
npm run build
```
The static site is generated into `out/`. Publish that folder with GitHub Pages.

If your repository name changes, update `repoName` in `next.config.mjs`.
A `.nojekyll` file is included in `public/` so the `_next` folder is served correctly.

## Notes
- This build is 100% static (no API routes, no DB, no NextAuth).
- Demo state (alerts, rules, verdict overrides) is stored in `localStorage`.
- The admin-only rules page is enforced in the browser (client-side guard).
