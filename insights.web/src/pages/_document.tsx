import { Head, Html, Main, NextScript } from "next/document";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head />
      <body>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
