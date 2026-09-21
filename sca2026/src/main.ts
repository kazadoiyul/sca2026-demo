// Crawlee - web scraping and browser automation library (Read more at https://crawlee.dev)
import { CheerioCrawler } from '@crawlee/cheerio';
// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor } from 'apify';

// this is ESM project, and as such, it requires you to specify extensions in your relative imports
// read more about this here: https://nodejs.org/docs/latest-v18.x/api/esm.html#mandatory-file-extensions
// note that we need to use `.js` even when inside TS files
import { router } from './routes.js';

interface Input {
    startUrls: {
        url: string;
    }[];
    maxRequestsPerCrawl: number;
}

// The She Code Africa website (https://shecodeafrica.org) is a React app, so its HTML arrives
// empty and there is nothing for Cheerio to read. The page fills itself from this public JSON
// API instead, so we scrape the API directly - it is faster and the data is already structured.
// This endpoint is paginated: it hands back 10 chapters at a time plus a `totalPages` count.
const CHAPTERS_API = 'https://sca-v3-backend-prod-05e311d52a38.herokuapp.com/api/chapters/member-chapters?page=1';

// The init() call configures the Actor to correctly work with the Apify-provided environment - mainly the storage infrastructure. It is necessary that every Actor performs an init() call.
await Actor.init();

// Structure of input is defined in input_schema.json
const { startUrls = [{ url: CHAPTERS_API }], maxRequestsPerCrawl = 20 } =
    (await Actor.getInput<Input>()) ?? ({} as Input);

const crawler = new CheerioCrawler({
    maxRequestsPerCrawl,
    // She Code Africa is a non-profit running on a small server, so stay gentle with it.
    maxConcurrency: 5,
    requestHandler: router,
});

await crawler.run(startUrls);

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit()
await Actor.exit();
