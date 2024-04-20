import {hash} from "./hash";

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
            const article = await env.ARTICLES.get(link);
            console.log(`found content ${article?.slice(0, 20)}`)

            const embeddingResponse = await env.AI.run(
                "@cf/baai/bge-large-en-v1.5",
                {
                    text: [article],
                }
            );
            console.log(`found ${embeddingResponse.data.length} embeddings`)
            console.log(`found an embedding of length ${embeddingResponse.data[0].length}`)

            await env.VECTORIZE_INDEX.upsert([{id, values: embeddingResponse.data[0], metadata: {link}}]);
            console.log(`embedding stored id: ${id}`)
        })

        await Promise.all(promises)
    }
};
