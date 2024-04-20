import {html} from "hono/html";

export const indexHtml = (response: string | null = null) => html`
    <section>
        <h1>Hello world</h1>
    </section>
    <section>
        <form action="/" method="post">
            <input type="text" name="query">
            <button type="submit">Submit</button>
        </form>
    </section>
    ${response === null
            ? html``
            : html`
                <section>
                    <p>${response}</p>
                </section>
            `}
`
