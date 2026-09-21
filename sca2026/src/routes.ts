import { createCheerioRouter } from '@crawlee/cheerio';

/** One She Code Africa community chapter, as returned by the API. */
interface Chapter {
    name: string;
    city?: string;
    country?: string;
    category?: { name?: string };
    /** The chapter's own page - usually a Linktree, Instagram, or X profile. */
    link?: string;
    description?: string;
    image?: string;
}

/** One page of chapters. */
interface ChaptersResponse {
    totalChapters: number;
    totalPages: number;
    currentPage: number;
    data: Chapter[];
}

/**
 * How many chapters we may save, and how many we have saved so far.
 * `main.ts` sets the limit from the Actor input before the crawl starts.
 */
export const results = {
    limit: Infinity,
    saved: 0,
};

export const router = createCheerioRouter();

// The API replies with JSON, so we read `json` here instead of the Cheerio `$` you would use on
// an HTML page. Crawlee parses it for us because the response says `Content-Type: application/json`.
router.addDefaultHandler(async ({ request, json, log, pushData, addRequests }) => {
    if (!json) {
        log.warning(`No JSON came back from ${request.url} - is this the chapters API?`);
        return;
    }

    const { data: chapters = [], currentPage, totalPages, totalChapters } = json as ChaptersResponse;

    log.info(`Page ${currentPage} of ${totalPages} - ${chapters.length} chapters here, ${totalChapters} in total`);

    for (const chapter of chapters) {
        if (results.saved >= results.limit) {
            log.info(`Reached the results limit of ${results.limit}, skipping the rest`);
            return;
        }

        // Most `city` values already end with the country ("Osun, Nigeria"), so only add it when missing.
        const city = chapter.city ?? '';
        const country = chapter.country ?? '';
        const where = city.toLowerCase().includes(country.toLowerCase()) ? city : [city, country].filter(Boolean).join(', ');
        log.info(`${chapter.name.trim()} (${where})`, { link: chapter.link });

        // Count before awaiting, so two pages running at once cannot overshoot the limit.
        results.saved++;

        // Save each chapter to the Dataset - a table-like storage you can export as JSON or CSV.
        await pushData({
            name: chapter.name,
            category: chapter.category?.name,
            city: chapter.city,
            country: chapter.country,
            link: chapter.link,
            description: chapter.description,
            image: chapter.image,
        });
    }

    // We only learn how many pages exist after fetching the first one, so queue the rest from here.
    // No point fetching them if this page already filled the limit.
    if (currentPage === 1 && totalPages > 1 && results.saved < results.limit) {
        const nextPages = [];
        for (let page = 2; page <= totalPages; page++) {
            const url = new URL(request.url);
            url.searchParams.set('page', String(page));
            nextPages.push(url.href);
        }

        log.info(`Queueing ${nextPages.length} more pages`);
        await addRequests(nextPages);
    }
});
