# Félix Member Portal

High-fidelity internal fintech operations prototype built with React + Vite + Tailwind.

## Deploy to GitHub Pages

1. Push this project to GitHub in the repository you want to publish.
2. Ensure your default branch is `main` (or update `.github/workflows/deploy-gh-pages.yml` if different).
3. In GitHub, open `Settings` -> `Pages`.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
5. Set **Branch** to `gh-pages` and folder to `/ (root)`, then save.
6. Commit and push to `main`; the workflow `Deploy to GitHub Pages` will run automatically.
7. After the workflow succeeds, your live demo will be available at:
   - `https://<github-username>.github.io/<repo-name>/`

### Notes

- Vite `base` is auto-computed for GitHub Pages during CI using `GITHUB_REPOSITORY`, so assets resolve correctly under `/<repo-name>/`.
- `.nojekyll` is included via `public/.nojekyll` to avoid Jekyll processing issues.
- This prototype does not use client-side URL routing; no hash-router conversion is required.
