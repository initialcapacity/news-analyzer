import {html} from "hono/html";

type IndexProperties = {
    query?: string | undefined,
    response?: string | undefined,
    source?: string | undefined,
};

export const indexHtml = ({query, response, source}: IndexProperties = {}) => html`
    <section>
        <h1>What would you like to know?</h1>
        <form action="/" method="post">
            <fieldset>
                <label>
                    ${query === undefined
                            ? html`Query`
                            : html`New Query`}
                    <input type="text" name="query">
                </label>
                <button type="submit">Ask</button>
            </fieldset>
        </form>
    </section>

    ${query === undefined
            ? html``
            : html`
                <section>
                    <h2>Question</h2>
                    <p>${query}</p>
                </section>
            `}
    ${response === undefined
            ? html``
            : html`
                <section>
                    <h2>Answer</h2>
                    <p>${response}</p>
                    ${source === undefined
                            ? html``
                            : html`
                                <h3>Source</h3>
                                <p><a href="${source}">${source}</a></p>
                            `}
                </section>
            `}
`
