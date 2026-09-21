# Build your first web scraper on Apify

Hackathon starter material. By the end of this page you will have built a web scraper, run it on
your own machine, deployed it to the cloud, and put a price on it - in about 40 minutes.

No prior Apify experience needed. If you can open a terminal, you can do this. Steps 1 to 5 are the
core; steps 6 and 7 take it to the cloud and to Apify Store.

## What you are building

An **[Actor](https://docs.apify.com/platform/actors)** is a small program that runs on
[the Apify platform](https://docs.apify.com/platform). It works like this:

```
JSON input  ->  your code runs  ->  results saved to a dataset
```

That is the whole idea. You give it some input (for example, a list of URLs), it does a job (for
example, scrapes those pages), and it writes the results to a
[dataset](https://docs.apify.com/platform/storage/dataset), which is a table-like storage you can
export as JSON, CSV, or Excel.

The scraper you create below starts from a ready-made template, so you do not write any scraping
code to get your first result.

> **Want to see the finished thing first?** The [`sca2026/`](./sca2026) folder is a working
> example built with exactly these steps. It scrapes every
> [She Code Africa](https://shecodeafrica.org) community chapter and its link. Peek at it any time
> you want to see where you are heading.

## Before you start

You need two things:

1. **[Node.js 22 or newer](https://nodejs.org/)** - the Apify CLI runs on Node. Download the LTS
   installer from [nodejs.org](https://nodejs.org/) if you do not have it.
2. **A free [Apify account](https://console.apify.com/sign-up)** - not needed for steps 1 to 5,
   which run entirely on your machine. You do need it from step 6 onwards, so sign up now and save
   yourself the detour.

Check your Node version:

```bash
node --version
```

If that prints something like `v22.11.0` or higher, you are good. If the command is not found or
the number is lower than 22, install Node first.

---

## Step 1: Install your tools

### The Apify CLI

The [Apify CLI](https://docs.apify.com/cli/) is the command line tool you use to create, run, and
later deploy Actors.

```bash
npm install -g apify-cli
```

Verify it worked:

```bash
apify --version
```

You should see a version number. If you get a permissions error on macOS or Linux, see the
[installation guide](https://docs.apify.com/cli/docs/installation) for alternatives such as
Homebrew.

### The Apify Actor Development skill (optional)

If you use an AI coding tool that supports Agent Skills - [Claude Code](https://docs.claude.com/en/docs/claude-code),
[Cursor](https://cursor.com/), or similar - install the Apify skill. It teaches your tool how
Actors are put together, so the code it writes actually fits the platform:

```bash
npx skills add https://github.com/apify/agent-skills --skill apify-actor-development
```

Pick `apify-actor-development` when prompted. You can browse the rest in the
[apify/agent-skills](https://github.com/apify/agent-skills) repo, and read what this one does in
its [SKILL.md](https://github.com/apify/agent-skills/blob/main/skills/apify-actor-development/SKILL.md).

Skip this if you would rather write everything yourself. Nothing later on this page depends on it.

---

## Step 2: Create your scraper from a template

Run this from wherever you keep your projects:

```bash
apify create
```

The CLI asks you a few questions:

1. **Actor name** - anything you like, for example `my-first-scraper`. This becomes the folder
   name, so stick to lowercase letters, numbers, and hyphens.
2. **Programming language** - pick **JavaScript**, **TypeScript**, or **Python**, whichever you
   are most comfortable with.
3. **Template** - pick a **Crawlee + CheerioCrawler** template (it is usually named something like
   "Crawlee + Cheerio"). Cheerio is fast and good for regular HTML pages. If your target site
   needs a real browser to render, pick a **Playwright** template instead.

The CLI creates a folder with all the files and installs the dependencies for you. Move into it:

```bash
cd my-first-scraper
```

> **Tip:** Browse every available starter at [Apify templates](https://apify.com/templates) before
> you choose. There is one for most common starting points.

---

## Step 3: Look around the files

Open the new folder in your editor. These are the parts that matter:

| File | What it is |
| --- | --- |
| `src/main.ts` (or `main.js` / `main.py`) | Your code. This is where the scraper starts. |
| [`.actor/actor.json`](https://docs.apify.com/platform/actors/development/actor-definition/actor-json) | Your Actor's name, version, and settings. |
| [`.actor/input_schema.json`](https://docs.apify.com/platform/actors/development/actor-definition/input-schema) | What input your Actor accepts. It also generates the input form in Apify Console. |
| [`Dockerfile`](https://docs.apify.com/platform/actors/development/actor-definition/dockerfile) | How your Actor gets built and run in the cloud. You rarely need to touch this. |
| `storage/` | Local storage. Created when you run the Actor. Your results land here. |

In the Cheerio template, `src/` also has a `routes` file. That is the part that runs for every page
the crawler visits and decides what to pull off it, so it is the first place to edit when you want
different data.

---

## Step 4: Run it locally

```bash
apify run
```

Watch the log. The crawler visits the start URLs, extracts data, and prints each result as it
saves it.

When it finishes, open:

```
storage/datasets/default/
```

Every result is one JSON file in that folder. That is your scraped data. The input the Actor read
is in `storage/key_value_stores/default/INPUT.json`, and you can edit that file to change the
input for your next local run.

> **Note:** Whether a rerun starts clean depends on your template. Crawlee templates, including
> the Cheerio one, purge the default request queue, dataset, and key-value store before every
> `apify run`, so you get the same results instead of duplicates. Add `--no-purge` to keep what is
> already in `storage/`. Templates that do not use Crawlee keep the storage instead, so the
> crawler remembers which URLs it visited: run `apify run --purge` (or `-p`) when you want a clean
> slate.

---

## Step 5: Make it yours

Now change one thing at a time and rerun:

- **Change the target site** - edit `startUrls` in `storage/key_value_stores/default/INPUT.json`,
  or change the default in `.actor/input_schema.json`.
- **Change what gets scraped** - in the route handler, the template grabs the page title. Swap that
  selector for whatever you actually want, and add fields to the object it saves.
- **Add an input option** - add a property to `.actor/input_schema.json`, then read it in your
  code.
- **Let your AI tool do it** - if you installed the skill in step 1, describe the change you want
  ("scrape the product price and rating too") and let the tool edit the route handler and the input
  schema for you. Read what it produces before you run it.

Rerun `apify run` after each change. Small steps, quick feedback.

> **Stuck with an empty page?** Some sites are React or Vue apps: the server sends an almost empty
> HTML file and the browser fills it in with JavaScript, so Cheerio sees nothing to scrape. Before
> reaching for a browser crawler, open the **Network** tab in your browser's developer tools and
> reload the page. If you spot a request returning JSON, you can often scrape that directly, which
> is far faster. The [`sca2026/`](./sca2026) example does exactly this.

---

## Step 6: Deploy it to the cloud

Your scraper works on your machine. Now put it on the Apify platform so it runs in the cloud, on a
schedule, and can be started by anyone over the API.

### 1. Get your API token

In Apify Console, open [**Settings > API & Integrations**](https://console.apify.com/settings/integrations)
and copy your personal API token.

### 2. Log in from the CLI

```bash
apify login
```

Paste the token when prompted. This links the CLI to your account, and you only do it once.

### 3. Push it

```bash
apify push
```

This uploads your code and builds your Actor in the cloud. It takes a minute or two. When it
finishes, the CLI prints a link to your Actor in Apify Console.

### 4. Run it in Apify Console

Open that link, check the input form (it is generated from your `input_schema.json`), and click
**Start**. When the run finishes, open the **Output** tab and confirm you get the same data you got
locally. See [Running Actors](https://docs.apify.com/platform/actors/running) for a tour of the
run screen.

### 5. Note your API endpoint

Every Actor gets an HTTP endpoint, so anything - your hackathon project, a cron job, another
agent - can start it and collect the results:

```
https://api.apify.com/v2/acts/<your-username>~<actor-name>/runs?token=<API_TOKEN>
```

Details in [Run Actor and retrieve data via API](https://docs.apify.com/academy/api/run-actor-and-retrieve-data-via-api).

> **Note:** Local `storage/` is local only. It is never uploaded by `apify push`. Cloud runs write
> to cloud storage, which you read in Apify Console or over the API.

---

## Step 7: Publish and monetize

Your scraper runs in the cloud. The last step is putting it on
[Apify Store](https://apify.com/store), where other people can find it, run it, and pay for it.

One requirement first: you cannot publish an Actor until it has at least one run on the platform.
If you started your Actor in step 6, you are already set. If you skipped that, go back and run it
in Apify Console once.

### 1. Publish to Apify Store

Open your Actor in Apify Console, go to the **Publishing** tab, and fill in every section: a logo
and description, monetization, sample output, output schema, and Actor permissions. Your Actor's
README becomes its Store page, so make it good. When all sections are marked complete, select
**Publish on Store**. Full checklist in
[Publish your Actor](https://docs.apify.com/platform/actors/publishing/publish).

### 2. Pick a pricing model

In the **Publishing** tab, open the **Monetization** section and follow the wizard. Scrapers use
**pay per event**: you define the events users pay for, such as each result returned, so the price
tracks the value you deliver.

Pick your **primary event** (the one that best represents what your Actor delivers, for example one
scraped item), review, and submit. Walkthrough in
[Monetize your Actor](https://docs.apify.com/platform/actors/publishing/monetize).

### 3. Watch your earnings

Once people are using it, your earnings show up in Apify Console under
**Development > Insights**. Payout invoices are generated monthly, and the same place is where you
fill in your payout details and verify your identity when you are ready to be paid. See
[Monthly payouts](https://docs.apify.com/platform/actors/publishing/monetize/monthly-payouts).

---

## Useful links

**Getting started**

- [Apify CLI installation](https://docs.apify.com/cli/docs/installation) and
  [command reference](https://docs.apify.com/cli/docs/reference)
- [Apify templates](https://apify.com/templates)
- [Web scraping for beginners](https://docs.apify.com/academy/web-scraping-for-beginners) academy
  course

**Writing the scraper**

- [Crawlee docs](https://crawlee.dev/) - the scraping library behind the templates
- [Cheerio docs](https://cheerio.js.org/) - how to select elements from HTML
- [Apify SDK for JavaScript](https://docs.apify.com/sdk/js) and
  [for Python](https://docs.apify.com/sdk/python)
- [apify/agent-skills](https://github.com/apify/agent-skills) - the Apify Actor Development skill
  for AI coding tools

**Actor structure and storage**

- [Actor definition](https://docs.apify.com/platform/actors/development/actor-definition)
- [Input schema](https://docs.apify.com/platform/actors/development/actor-definition/input-schema)
- [Storage and datasets](https://docs.apify.com/platform/storage)

**Deploying, publishing, and monetizing**

- [Deploying your Actor](https://docs.apify.com/platform/actors/development/deployment)
- [Running Actors](https://docs.apify.com/platform/actors/running) and
  [Run Actor and retrieve data via API](https://docs.apify.com/academy/api/run-actor-and-retrieve-data-via-api)
- [Publish your Actor](https://docs.apify.com/platform/actors/publishing/publish) and the
  [publishing overview](https://docs.apify.com/platform/actors/publishing)
- [Monetize your Actor](https://docs.apify.com/platform/actors/publishing/monetize)
- [Apify API reference](https://docs.apify.com/api/v2)

**Skip the building**

- [Apify Store](https://apify.com/store) - thousands of ready-made scrapers you can call from your
  own project instead of writing one
- [Apify API reference](https://docs.apify.com/api/v2) - run any Actor from any stack
