type Item = {
    link: string,
    content_encoded: string,
}

type NewsResult = {
    rss: { channel: {item: Item[]} }
}

const fetchDocuments = async (feedUrl: string): Promise<Item[]> => {
    const result = await fetch(feedUrl)
    if (!result.ok) {
        console.log(`Unable to collect articles for ${feedUrl}`)
    }
    const json = await result.json() as NewsResult;

    const articles = json.rss.channel.item;
    console.log(`Found ${articles.length} articles for ${feedUrl}`)
    return articles;
};

const saveDocuments = async (articles: Item[], store: KVNamespace, feedUrl: string): Promise<void> => {
    const promises = articles.map(async article => {
        await store.put(article.link, article.content_encoded);
    });
    await Promise.all(promises)
    console.log(`Saved ${articles.length} articles for ${feedUrl}`)
};

const processFeed = (store: KVNamespace) => async (feedUrl: string): Promise<void> => {
    console.log(`Collecting articles for ${feedUrl}`)

    const articles = await fetchDocuments(feedUrl);
    await saveDocuments(articles, store, feedUrl);
}

export default {
    scheduled: async (event: ScheduledEvent, env: Env, ctx: ExecutionContext) => {
        const feeds = env.FEED_URLS;
        console.log(`Collecting news for ${feeds.length} feeds`)

        await Promise.all(feeds.map(processFeed(env.ARTICLES)))
    }
};
