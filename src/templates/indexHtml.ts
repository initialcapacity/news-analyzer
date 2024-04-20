import {html} from "hono/html";

export const indexHtml = ({response, source}: {response?: string | undefined, source?: string | undefined} = {}) => html`
    <section>
        <h1>What would you like to know?</h1>
        <form action="/" method="post">
            <fieldset>
                <label for="">
                    Question
                    <input type="text" name="query">
                </label>
                <button type="submit">Ask</button>
            </fieldset>
        </form>
        ${response === undefined
                ? html``
                : html`<p>${response}</p>`}
        ${source === undefined
                ? html``
                : html`
                    <p>Source: <a href="${source}">${source}</a></p>
                `}
    </section>
`
