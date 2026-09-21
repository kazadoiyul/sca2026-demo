# Guidance for AI coding tools

This repo is hackathon starter material for building a web scraper on Apify. The full
walkthrough lives in [`README.md`](./README.md): prerequisites, installing the Apify CLI,
creating an Actor from a template, running it locally, and customizing it.

The audience is beginners with no prior Apify experience. Keep explanations concrete and the
step count low.

## Repo layout

- [`README.md`](./README.md) - the walkthrough participants follow.
- [`sca2026/`](./sca2026) - the finished example scraper (TypeScript, Crawlee + CheerioCrawler),
  created with the exact steps in the README. Treat it as reference material.

Participants scaffold their own Actor in their own folder with `apify create`. Do not rewrite
`sca2026/` to become someone else's project.

## Defer to the Apify Actor Development skill

For scaffolding, building, debugging, or deploying Actors, defer to the **Apify Actor
Development Agent Skill** (`apify-actor-development`, installed in `.agents/`). Do not duplicate
its instructions here.

```bash
npx skills add https://github.com/apify/agent-skills --skill apify-actor-development
```

## Scraper lifecycle (the workflow this repo teaches)

1. **Install the CLI** - `npm install -g apify-cli`.
   [Installation](https://docs.apify.com/cli/docs/installation).
2. **Scaffold** - `apify create`, then pick a Crawlee + Cheerio template.
   [Templates](https://apify.com/templates).
3. **Run locally** - `apify run`. Output lands in `storage/datasets/default/`.
   [Storage](https://docs.apify.com/platform/storage).
4. **Deploy** (beyond the README's main scope) - `apify login` then `apify push`.
   [Deployment](https://docs.apify.com/platform/actors/development/deployment).

## Actor anatomy

- [`.actor/actor.json`](https://docs.apify.com/platform/actors/development/actor-definition/actor-json) -
  metadata and config.
- [`.actor/input_schema.json`](https://docs.apify.com/platform/actors/development/actor-definition/input-schema) -
  the JSON input shape.
- `src/` - Actor code (`main` entry point), plus the route handler that runs per page.
- [`Dockerfile`](https://docs.apify.com/platform/actors/development/actor-definition/dockerfile) -
  build and run definition.
- Output goes to a [dataset](https://docs.apify.com/platform/storage/dataset).
- Keep secrets in env vars or [`apify secrets`](https://docs.apify.com/platform/actors/development/programming-interface/environment-variables),
  never in the repo.

## Writing style (for any docs edits)

- "Actor" is always capitalized when it means an Apify Actor. "task" and "schedule" stay
  lowercase.
- Use "Apify Store", "Apify Console", "Apify Proxy" (no "the"), but "the Apify platform".
- Headings in sentence case, never title case.
- No em dashes. Use a spaced hyphen ` - ` instead.
- US English, Oxford comma.
- Write for beginners: short sentences, one action per step, say what success looks like.
