type Env = {
    __STATIC_CONTENT: KVNamespace,
    __STATIC_CONTENT_MANIFEST: string,
    AI: Ai;
    VECTORIZE_INDEX: VectorizeIndex,
    ARTICLES: KVNamespace,
    FEED_URL: string,
}

type EmbeddingResponse = {
    shape: number[];
    data: number[][];
}
