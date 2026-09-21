# She Code Africa chapters scraper

Scrapes every [She Code Africa](https://shecodeafrica.org) community chapter - the name, where it is, and the link to its own page - and saves them to a dataset.

Built from the TypeScript [Crawlee](https://crawlee.dev/) + [CheerioCrawler](https://crawlee.dev/api/cheerio-crawler/class/CheerioCrawler) Actor template, then customized.

## Quick Start

Once you've installed the dependencies, start the Actor:

```bash
apify run
```

Once your Actor is ready, you can push it to the Apify Console:

```bash
apify login # first, you need to log in if you haven't already done so

apify push
```

## Project Structure

```text
.actor/
├── actor.json # Actor config: name, version, env vars, runtime settings
├── dataset_schema.json # Structure and representation of data produced by an Actor
├── input_schema.json # Input validation & Console form definition
└── output_schema.json # Specifies where an Actor stores its output
src/
├── main.ts # Actor entry point and orchestrator
└── routes.ts # Handles each API page and saves chapters to the dataset
storage/ # Local storage (mirrors Cloud during development)
├── datasets/ # Output items (JSON objects)
├── key_value_stores/ # Files, config, INPUT
└── request_queues/ # Pending crawl requests
Dockerfile # Container image definition
```

For more information, see the [Actor definition](https://docs.apify.com/platform/actors/development/actor-definition) documentation.

## How it works

The She Code Africa website is a React app, so the HTML the server sends back is an empty
`<div id="root">` - there is nothing in it for Cheerio to read. The page fills itself from a
public JSON API, so this Actor scrapes that API directly. It is faster than rendering a browser,
and the data arrives already structured.

- The crawler starts at page 1 of the chapters API, taken from the `startUrls` input field.
- The response says how many pages exist, so `src/routes.ts` queues the remaining pages with
  `addRequests()` after handling the first one.
- Each chapter is saved to the dataset with its name, category, city, country, link, description,
  and image.

At the time of writing that is 46 chapters across 9 countries, fetched in 5 requests.

> **Note:** She Code Africa is a non-profit running on a small server, so `maxConcurrency` is set
> to 5 in `src/main.ts`. Please keep it low.

## Example output

```json
{
    "name": "SCA UNN",
    "category": "Campus",
    "city": "Enugu",
    "country": "Nigeria",
    "link": "https://linktr.ee/scaunn",
    "description": "An SCA Chapter in the University of Nigeria Nsukka, Enugu",
    "image": "https://ik.imagekit.io/gcrrtxwk5/SCA_WEBSITE_V3/PRODUCTION/CHAPTERS/50.png"
}
```

## What's included

- **[Apify SDK](https://docs.apify.com/sdk/js)** - toolkit for building [Actors](https://apify.com/actors)
- **[Crawlee](https://crawlee.dev/)** - web scraping and browser automation library
- **[Input schema](https://docs.apify.com/platform/actors/development/input-schema)** - define and easily validate a schema for your Actor's input
- **[Dataset](https://docs.apify.com/sdk/python/docs/concepts/storages#working-with-datasets)** - store structured data where each object stored has the same attributes
- **[Cheerio](https://cheerio.js.org/)** - a fast, flexible & elegant library for parsing and manipulating HTML and XML
- **[Proxy configuration](https://docs.apify.com/platform/proxy)** - rotate IP addresses to prevent blocking

## Resources

- [Quick Start](https://docs.apify.com/platform/actors/development/quick-start) guide for building your first Actor
- [Video tutorial](https://www.youtube.com/watch?v=yTRHomGg9uQ) on building a scraper using CheerioCrawler
- [Written tutorial](https://docs.apify.com/academy/web-scraping-for-beginners/challenge) on building a scraper using CheerioCrawler
- [Web scraping with Cheerio in 2023](https://blog.apify.com/web-scraping-with-cheerio/)
- How to [scrape a dynamic page](https://blog.apify.com/what-is-a-dynamic-page/) using Cheerio
- [Integration with Zapier](https://apify.com/integrations), Make, Google Drive and others
- [Video guide on getting data using Apify API](https://www.youtube.com/watch?v=ViYYDHSBAKM)

## Creating Actors with templates

[How to create Apify Actors with web scraping code templates](https://www.youtube.com/watch?v=u-i-Korzf8w)


## Getting started

For complete information [see this article](https://docs.apify.com/platform/actors/development#build-actor-locally). To run the Actor use the following command:

```bash
apify run
```

## Deploy to Apify

### Connect Git repository to Apify

If you've created a Git repository for the project, you can easily connect to Apify:

1. Go to [Actor creation page](https://console.apify.com/actors/new)
2. Click on **Link Git Repository** button

### Push project on your local machine to Apify

You can also deploy the project on your local machine to Apify without the need for the Git repository.

1. Log in to Apify. You will need to provide your [Apify API Token](https://console.apify.com/account/integrations) to complete this action.

    ```bash
    apify login
    ```

2. Deploy your Actor. This command will deploy and build the Actor on the Apify Platform. You can find your newly created Actor under [Actors -> My Actors](https://console.apify.com/actors?tab=my).

    ```bash
    apify push
    ```

## Documentation reference

To learn more about Apify and Actors, take a look at the following resources:

- [Apify SDK for JavaScript documentation](https://docs.apify.com/sdk/js)
- [Apify SDK for Python documentation](https://docs.apify.com/sdk/python)
- [Apify Platform documentation](https://docs.apify.com/platform)
- [Join our developer community on Discord](https://discord.com/invite/jyEM2PRvMU)
