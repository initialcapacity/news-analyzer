import {html} from "hono/html";

type IndexProperties = {
    query?: string | undefined,
    response?: string | undefined,
    source?: string | undefined,
};

export const indexHtml = ({query, response, source}: IndexProperties = {}) => {
    const heading = query === undefined ? "What would you like to know?" : "What else would you like to know?"
    const label = query === undefined ? "Query" : "New Query"

    return html`
        <section>
            <h1>${heading}</h1>
            <form action="/" method="post">
                <fieldset>
                    <label>
                        ${label}
                        <input type="text" name="query">
                    </label>
                    <button type="submit">Ask</button>
                </fieldset>
            </form>
        </section>

        ${query === undefined
                ? null
                : html`
                    <section>
                        <h2>Question</h2>
                        <p>${query}</p>
                    </section>
                `}
        ${response === undefined
                ? null
                : html`
                    <section>
                        <h2>Answer</h2>
                        <p>${response}</p>
                        ${source === undefined
                        ? null
                        : html`
                                    <h3>Source</h3>
                                    <p><a href="${source}">${source}</a></p>
                                `}
                    </section>
                `}
    `;
}
