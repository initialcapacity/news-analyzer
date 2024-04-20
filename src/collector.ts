type Item = {
    link: string,
    content_encoded: string,
}

type NewsResult = {
    rss: { channel: {item: Item[]} }
}

export default {
    scheduled: async (event: ScheduledEvent, env: Env, ctx: ExecutionContext) => {
        console.log('Collecting news')

        const result = await fetch(env.FEED_URL)
        if (!result.ok) {
            console.error('Unable to fetch news')
        }
        const json = await result.json() as NewsResult;

        const articles = json.rss.channel.item;
        const promises = articles.map(async article => {
            await env.ARTICLES.put(article.link, article.content_encoded);
        });

        await Promise.all(promises)
    }
};
