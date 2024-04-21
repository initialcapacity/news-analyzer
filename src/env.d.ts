type Ai = {
    run: (string, any) => Promise<any>
}

type Env = {
    __STATIC_CONTENT: KVNamespace,
    __STATIC_CONTENT_MANIFEST: string,
    AI: Ai;
    VECTORIZE_INDEX: VectorizeIndex,
    ARTICLES: KVNamespace,
    FEED_URLS: string[],
}

type EmbeddingResponse = {
    shape: number[];
    data: number[][];
}
