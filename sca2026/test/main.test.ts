import { CheerioCrawler, purgeDefaultStorages } from '@crawlee/cheerio';
import { beforeAll, describe, expect, it } from 'vitest';

import { router } from '../src/routes.js';

const CHAPTERS_API = 'https://sca-v3-backend-prod-05e311d52a38.herokuapp.com/api/chapters/member-chapters?page=1';

describe('CheerioCrawler', () => {
    beforeAll(async () => {
        await purgeDefaultStorages();
    });

    it('should scrape She Code Africa chapters into the dataset', async () => {
        const crawler = new CheerioCrawler({
            maxRequestsPerCrawl: 2,
            maxConcurrency: 1,
            requestHandler: router,
        });

        await crawler.run([CHAPTERS_API]);

        expect(crawler.stats.state.requestsFinished).toBeGreaterThanOrEqual(1);

        const { items } = await crawler.getData();
        expect(items.length).toBeGreaterThan(0);
        expect(items[0].name).toBeTruthy();
        expect(items[0].country).toBeTruthy();
    }, 60_000);
});
