// @ts-ignore
import manifest from "__STATIC_CONTENT_MANIFEST";

import {Hono} from "hono";
import {serveStatic} from "hono/cloudflare-workers";
import {layout} from "./templates/layoutHtml";
import {indexHtml} from "./templates/indexHtml";

const app = new Hono<{ Bindings: Env }>();

app.get('/static/*', serveStatic({root: './', manifest}))
app.get('/', c => c.html(layout(indexHtml())))

const createEmbedding = async (ai: Ai, query: string): Promise<number[]> => {
    const queryVector: EmbeddingResponse = await ai.run('@cf/baai/bge-large-en-v1.5', {
        text: [query],
    });
    return queryVector.data[0];
};

const searchEmbeddings = async (index: VectorizeIndex, queryVector: number[]): Promise<string | undefined> => {
    const result = await index.query(queryVector, {topK: 1, returnMetadata: true});
    return result.matches[0]?.metadata?.link as string | undefined;
};

const retrieveArticle = async (store: KVNamespace, matchLink: string) => await store.get(matchLink);

const fetchTextCompletion = async (ai: Ai, article: string, query: string): Promise<string> => {
    const messages = [
        {role: "system", content: "You are a reporter for a major world newspaper."},
        {
            role: "system",
            content: `Use the following article as a source respond to the user's query: ${article.slice(0, 5500)}`
        },
        {
            role: "system",
            content: "Write your response as if you were writing a short, high-quality news article for your paper. Limit your response to one paragraph"
        },
        {
            role: "user",
            content: query,
        },
    ];

    const textResult = await ai.run("@cf/meta/llama-3-8b-instruct", {messages});
    return textResult.response;
};

app.post('/', async c => {
    const data = await c.req.formData()
    const query = data.get("query")
    if (typeof query !== "string") {
        return c.html(layout(indexHtml({response: "Unable to answer query"})));
    }

    const queryVector = await createEmbedding(c.env.AI, query);

    const source = await searchEmbeddings(c.env.VECTORIZE_INDEX, queryVector);
    if (source === undefined) {
        return c.html(layout(indexHtml({query, response: "Unable to answer query"})));
    }

    const article = await retrieveArticle(c.env.ARTICLES, source);
    if (article === null) {
        return c.html(layout(indexHtml({query, response: "Unable to answer query", source: source})));
    }

    const response = await fetchTextCompletion(c.env.AI, article, query);

    return c.html(layout(indexHtml({query, response, source})));
})

export default app satisfies ExportedHandler<Env>;
