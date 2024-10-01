import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
     
            <link  as="image" href="/assets/home/BannerDark1.webp" />
            <link as="image" href="/assets/home/BannerLight1.webp" />

        </Head>
            <body>
              <Main />
              <NextScript />
            </body>
          </Html>
          )
}
