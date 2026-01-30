# Anti-Phishing Lab (Static Demo)

Static GitHub Pages build of the Anti-Phishing Lab. All data is seeded locally in the bundle and runs entirely in the browser -- no server, no database, no credentials required.

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
- Demo state (alerts, rules) is stored in `localStorage` on the client.
- Admin-only rules page is enforced in the browser (client-side guard).

## Optional archived backend
The original Prisma + NextAuth backend setup is preserved under `archive/` for reference only. It is not used in the GitHub Pages build.
