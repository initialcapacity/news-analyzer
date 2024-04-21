import {hash} from "./hash";

const retrieveArticle = async (store: KVNamespace, link: string) => {
    const article = await store.get(link);
    console.log(`found content ${article?.slice(0, 20)}`)
    return article;
};

const createEmbedding = async (ai: Ai, article: string | null): Promise<number[]> => {
    const embeddingResponse = await ai.run(
        "@cf/baai/bge-large-en-v1.5",
        {
            text: [article],
        }
    );
    return embeddingResponse.data[0];
};

const saveEmbedding = async (index: VectorizeIndex, id: string, embedding: number[], link: string) => {
    await index.upsert([{id, values: embedding, metadata: {link}}]);
    console.log(`embedding stored id: ${id}`)
};

export default {
    scheduled: async (event: ScheduledEvent, env: Env, ctx: ExecutionContext) => {
        console.log('Analyzing news')

        const list = await env.ARTICLES.list()

        const promises = list.keys.map(key => key.name).map(async link => {
            const id = await hash(link);
            const existingEmbeddings = await env.VECTORIZE_INDEX.getByIds([id]);
            if (existingEmbeddings.length > 0) {
                console.log(`skipping ${id}: ${link}`)
                return
            }
            console.log(`analyzing article ${id}: ${link}`)

            const article = await retrieveArticle(env.ARTICLES, link);
            const embedding = await createEmbedding(env.AI, article);
            await saveEmbedding(env.VECTORIZE_INDEX, id, embedding, link);
        })

        await Promise.all(promises)
    }
};
