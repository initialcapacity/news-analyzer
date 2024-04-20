import {html} from "hono/html";

export const indexHtml = ({response, source}: {response?: string | undefined, source?: string | undefined} = {}) => html`
    <section>
        <h1>Hello world</h1>
    </section>
    <section>
        <form action="/" method="post">
            <input type="text" name="query">
            <button type="submit">Submit</button>
        </form>
    </section>
    ${response === undefined
            ? html``
            : html`
                <section>
                    <p>${response}</p>
                </section>
            `}
    ${source === undefined
            ? html``
            : html`
                <section>
                    Source: <a href="${source}">${source}</a>
                </section>
            `}
`
