import {html} from "hono/html";
import {HtmlEscapedString} from "hono/utils/html";

type TemplateString = HtmlEscapedString | Promise<HtmlEscapedString>

export const layout = (content: TemplateString): TemplateString => html`
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>News Analyzer</title>
        <link rel="stylesheet" href="/static/css/reset.css">
        <link rel="stylesheet" href="/static/css/theme.css">
        <link rel="stylesheet" href="/static/css/typography.css">
        <link rel="stylesheet" href="/static/css/layout.css">
        <link rel="stylesheet" href="/static/css/buttons.css">
        <link rel="stylesheet" href="/static/css/forms.css">

        <link rel="icon" href="/static/favicon.ico" sizes="48x48">
        <link rel="icon" href="/static/favicon.svg" sizes="any" type="image/svg+xml"/>
    </head>
    <body>
    <header>
        <a href="/">
            <ul>
                <li>
                    <svg class="logo">
                        <use xlink:href="/static/images/icons.svg#logo"></use>
                    </svg>
                </li>
                <li class="heading">
                    <h1>News analyzer</h1>
                </li>
            </ul>
        </a>
    </header>
    <main>
        ${content}
    </main>
    <footer>
        <span>
            <script>document.write("&copy;" + new Date().getFullYear());</script>
            Initial Capacity, Inc.
        </span>
    </footer>
    </body>
    </html>
`
