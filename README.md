# Panellinies

A TypeScript and Vite app for browsing exam papers.

## Local development

Install a current Node.js LTS release, then run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Run `npm run build` to type-check and create the production site in `dist/`, or `npm run preview` to preview that build.

## Deploy to Vercel

Import this repository into Vercel and select the Vite framework preset. The build command is `npm run build` and the output directory is `dist`. The PDFs in `public/papers` are included in the deployed site.

### GitHub Actions deployment

The workflow in `.github/workflows/ci-cd.yml` builds pull requests and pushes to `main`. After a successful build on `main`, it stages a production deployment, checks the site and PDF links, then promotes it. It can also be run manually on `main`.

To connect it:

1. Create or import the project in Vercel. If Vercel's Git integration is enabled, disable its automatic deployments for this project to avoid duplicate deployments.
2. Link the project locally with `npx vercel link`. Find `orgId` and `projectId` in `.vercel/project.json` (do not commit that file).
3. In GitHub repository settings, create an environment named `production`. Add environment variables `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` with those values, and add a `VERCEL_TOKEN` environment secret containing a Vercel access token with access to the project. Do not put the token in the repository.
4. Restrict the environment to the `main` branch and protect that branch so only reviewed changes can run the secret-bearing deployment job. Configure required environment reviewers if desired.
5. Commit and push the workflow and app to GitHub. The first successful push to `main` will run the pipeline.

The smoke checks require the staged production URL to be accessible to the GitHub runner. If Vercel Deployment Protection is enabled, configure an appropriate automation bypass or adjust the checks before enabling the pipeline.
