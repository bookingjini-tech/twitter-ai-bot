import axios from 'axios';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

const KEYWORDS = [
    "startup funding",
    "AI product launch",
    "deeptech India",
    "AI regulation",
    "VC funding news",
    "open source AI",
    "Series A startup",
    "business model innovation",
    "global tech policy"
];

const ALLOWED_DOMAINS = [
    "techcrunch.com",
    "yourstory.com",
    "businessinsider.com",
    "economictimes.indiatimes.com",
    "wired.com",
    "theverge.com",
    "moneycontrol.com",
    "livemint.com",
    "forbes.com",
    "indianexpress.com",
    "inc42.com",
    "cnbc.com",
    "reuters.com",
    "bloomberg.com",
    "venturebeat.com",
    "mint.com",
    "hindustantimes.com"
];


async function isValidURL(url) {
    try {
        const res = await axios.head(url);
        return res.status < 400;
    } catch {
        return false;
    }
}

export async function getNews() {
    const query = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];

    const res = await axios.get(GOOGLE_SEARCH_URL, {
        params: {
            key: process.env.GOOGLE_API_KEY,
            cx: process.env.GOOGLE_CSE_ID,
            q: query,
            num: 15, // get more to filter
            dateRestrict: 'd1'
        }
    });

    const items = res?.data?.items || [];

    for (const item of items) {
        const link = item.link;
        const isTrusted = ALLOWED_DOMAINS.some(domain => link.includes(domain));
        const isLive = await isValidURL(link);

        if (isTrusted && isLive) {
            return {
                title: item.title,
                link: link,
                snippet: item.snippet
            };
        }
    }

    return null; // nothing useful found
}

export async function postTweet(tweetText) {
    const twitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    if (!tweetText) return "❌ No tweet text provided.";

    const maxLength = 270;

    if (tweetText.length > maxLength) {
        console.warn(`⚠️ Tweet too long (${tweetText.length} chars). Trimming to ${maxLength}...`);
        tweetText = tweetText.slice(0, maxLength - 3).trim() + '...';
    }

    try {
        const { data } = await twitterClient.v2.tweet(tweetText);
        return `✅ Tweet posted: ${data.text}`;
    } catch (err) {
        return `❌ Twitter API error: ${err.message}`;
    }
}
