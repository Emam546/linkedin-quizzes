import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {
                    // eslint-disable-next-line @next/next/no-sync-scripts
                    <script
                        src="https://kit.fontawesome.com/7d5b5d6967.js"
                        crossOrigin="anonymous"
                    ></script>
                }
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
