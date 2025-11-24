import {JSDOM} from "jsdom";
import {Readability} from "@mozilla/readability";
import {Article} from "./Article.js";
import {generalClean} from "./SpecificCleanup/generalClean.js";
import {cleanAfterArray, individualClean} from "./SpecificCleanup/pageSpecificClean.js";
import DOMPurify from "dompurify";

// Timeout wrapper for async operations
function withTimeout(promise, timeoutMs, errorMsg) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
        )
    ]);
}

export async function basic_readability_cleanup(url) {

    return (await get_readability_article(url)).content
}

export async function advanced_readability_cleanup(url, htmlContent = null) {
    // Wrap the entire operation in a 8-second timeout
    return withTimeout(
        (async () => {
            let article;
            if (htmlContent) {
                // Parse provided HTML content
                article = await get_readability_article(url, htmlContent);
            } else {
                // Fetch HTML from URL
                article = await Article(url);
            }

            let cleanedContent = generalClean(article.content);

            cleanedContent = individualClean(cleanedContent, url, cleanAfterArray);

            const window = new JSDOM('').window;
            const purify = DOMPurify(window);
            cleanedContent = purify.sanitize(cleanedContent);

            return cleanedContent;
        })(),
        8000,
        'Processing timeout - HTML too complex'
    );
}


export async function get_readability_article(url, htmlContent = null) {
    // Wrap in 8-second timeout to prevent hanging
    return withTimeout(
        (async () => {
            let html;
            if (htmlContent) {
                // Use provided HTML content
                html = htmlContent;
            } else {
                // Fetch the HTML content of the provided URL
                const response = await fetch(url);
                html = await response.text();
            }

            // Create a DOM from the HTML
            const { window } = new JSDOM(html);
            const doc = window.document;

            // Use Readability to extract the article content
            const reader = new Readability(doc);
            const article = reader.parse();
            if (article === null) {
                throw new Error("Readability failed to parse article")
            }

            return article;
        })(),
        8000,
        'Readability parsing timeout - HTML too complex'
    );
}