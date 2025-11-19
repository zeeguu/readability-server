import {JSDOM} from "jsdom";
import {Readability} from "@mozilla/readability";
import {Article} from "./Article.js";
import {generalClean} from "./SpecificCleanup/generalClean.js";
import {cleanAfterArray, individualClean} from "./SpecificCleanup/pageSpecificClean.js";
import DOMPurify from "dompurify";

export async function basic_readability_cleanup(url) {

    return (await get_readability_article(url)).content
}

export async function advanced_readability_cleanup(url, htmlContent = null) {
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

    return cleanedContent
}


export async function get_readability_article(url, htmlContent = null) {

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
}