import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://code.highcharts.com/css/highcharts.css"/>
          <link rel="stylesheet" href="https://code.highcharts.com/css/stocktools/gui.css"/>
            <link rel="stylesheet" href="https://code.highcharts.com/css/annotations/popup.css"/>
            <link rel="preload" as="image" href="/assets/home/BannerDark1.webp" />
            <link rel="preload" as="image" href="/assets/home/BannerLight1.webp" />

        </Head>
            <body>
              <Main />
              <NextScript />
            </body>
          </Html>
          )
}
