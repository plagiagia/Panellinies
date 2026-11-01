# Panellinies

A TypeScript and Vite app for browsing exam papers.

## Local development

Install a current Node.js LTS release, then run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Run `npm run build` to type-check and create the production site in `dist/`, or `npm run preview` to preview that build.

## Topics and questions

The topic catalogue is maintained in `src/topics-data.ts`. Each topic has a subject, related topic IDs and links to classified questions. It covers the 2025 and 2026 maths and physics papers. Add question anchors to new exam pages and include their year in the data when classifying more papers. Run `npm test` to check topic relationships and question links.

## Deploy to Vercel

Import this repository into Vercel and select the Vite framework preset. The build command is `npm run build` and the output directory is `dist`. The PDFs in `public/papers` are included in the deployed site.

## Student discussions

Students can use the site-wide account button to sign in with Google or email/password. They can read discussions publicly, while the comment form only appears after sign-in. Google users' given names appear on their comments (or a generic name if unavailable). Comments are saved in Supabase and are not stored in the browser.

1. Create a Supabase project and run `comments.sql` in its SQL editor. Manage or remove inappropriate comments from the Supabase table editor.
2. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY` (the public anon key), and `SUPABASE_SERVICE_ROLE_KEY` as Vercel environment variables. The service role key must stay secret and must never have a `VITE_` prefix. Set the same variables in `.env.local` for local development; see `.env.example`.
3. In Supabase Authentication URL settings, set the site URL to the deployed site and add the production and local `/account.html` URLs to the redirect allow list. Configure email confirmation and an email provider appropriate for your audience.
4. In Google Cloud, create a web OAuth client and add the Supabase callback URL shown under Authentication → Sign In / Providers → Google as an authorized redirect URI. Add the Google client ID and secret to that Supabase provider and enable it. Configure Google's consent screen and publishing status for production. Never put the Google client secret in this repository. See the [Supabase Google setup guide](https://supabase.com/docs/guides/auth/social-login/auth-google).
5. Deploy the changes. The Vite-only `npm run dev` server does not run `/api`; use `vercel dev` with the environment variables for local end-to-end testing.

The discussions currently load the latest 100 comments in each room. They are not a real-time chat; reopen a room to load new comments. Configure rate limits and an active moderation process before opening the discussions to students.

### GitHub Actions deployment

The workflow in `.github/workflows/ci-cd.yml` builds pull requests and pushes to `main`. After a successful build on `main`, it stages a production deployment, checks the site and PDF links, then promotes it. It can also be run manually on `main`.

To connect it:

1. Create or import the project in Vercel. If Vercel's Git integration is enabled, disable its automatic deployments for this project to avoid duplicate deployments.
2. Link the project locally with `npx vercel link`. Find `orgId` and `projectId` in `.vercel/project.json` (do not commit that file).
3. In GitHub repository settings, create an environment named `production`. Add environment variables `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` with those values, and add a `VERCEL_TOKEN` environment secret containing a Vercel access token with access to the project. Do not put the token in the repository.
4. Restrict the environment to the `main` branch and protect that branch so only reviewed changes can run the secret-bearing deployment job. Configure required environment reviewers if desired.
5. Commit and push the workflow and app to GitHub. The first successful push to `main` will run the pipeline.

The smoke checks require the staged production URL to be accessible to the GitHub runner. If Vercel Deployment Protection is enabled, configure an appropriate automation bypass or adjust the checks before enabling the pipeline.

## Interactive study prototype

The homepage is a study dashboard, with grouped concept paths, a derivative exploration and a review list. Every exam question supports focus mode, yellow/green text highlights, personal notes, a review bookmark and a self-reported studied state. Shared exam instructions, figures and PDF downloads remain available.

Study data uses browser localStorage (`study:v1:` keys). It is specific to the browser, shared by people using that browser profile, and is not synced to Supabase accounts. Clearing site data removes it. Studied counts reflect the student's own choices, not an assessed mastery score. Highlights are ignored if their source text changes. Exam solutions and automatic grading are not implemented; only the homepage demonstration has answer feedback.

`npm test` checks topic links/grouping, study persistence/error handling and the comments API. For the optional browser regression check, install Playwright outside the project, set `PLAYWRIGHT_MODULE` to its `index.mjs`, run the dev server, then run `node tests/prototype.browser.mjs`. The check uses installed Microsoft Edge, an isolated browser context and writes screenshots to TEMP. Set `TEST_URL` to test another local server.
