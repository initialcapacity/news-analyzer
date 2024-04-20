// @ts-ignore
import manifest from "__STATIC_CONTENT_MANIFEST";

import {Hono} from "hono";
import {serveStatic} from "hono/cloudflare-workers";
import {layout} from "./templates/layoutHtml";
import {indexHtml} from "./templates/indexHtml";

const app = new Hono<{ Bindings: Env }>();

app.get('/static/*', serveStatic({root: './', manifest}))
app.get('/', c => c.html(layout(indexHtml())))
app.post('/', async c => {
    const data = await c.req.formData()
    const query = data.get("query")
    if (typeof query !== "string") {
        return c.html(layout(indexHtml({response: "Unable to answer query"})));
    }

    const queryVector: EmbeddingResponse = await c.env.AI.run('@cf/baai/bge-large-en-v1.5', {
        text: [query],
    });

    const result = await c.env.VECTORIZE_INDEX.query(queryVector.data[0], { topK: 1, returnMetadata: true });
    const numberOfResults = result.matches.length;

    const totalVectors = (await c.env.VECTORIZE_INDEX.describe()).vectorsCount
    console.log(`found ${numberOfResults} results among ${totalVectors} vectors`)

    const metadata = result.matches[0]?.metadata;
    if (metadata === undefined) {
        return c.html(layout(indexHtml({query, response: "Unable to answer query"})));
    }

    const matchLink = metadata.link as string;
    const article = await c.env.ARTICLES.get(matchLink)
    if (article === null) {
        return c.html(layout(indexHtml({query, response: "Unable to answer query", source: matchLink})));
    }
    const messages = [
        { role: "system", content: "You are a friendly assistant" },
        { role: "system", content: `Use the following article to answer the user's question: ${article.slice(0, 5500)}` },
        {
            role: "user",
            content: query,
        },
    ];

    const textResult = await c.env.AI.run("@cf/meta/llama-2-7b-chat-fp16", { messages });
    return c.html(layout(indexHtml({query, response: textResult.response, source: matchLink})));
})

export default app satisfies ExportedHandler<Env>;
