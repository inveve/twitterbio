import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your next Twitter Deez Nuts Joke in seconds."
          />
          <meta property="og:site_name" content="deeztweets.com/" />
          <meta
            property="og:description"
            content="Generate your next Twitter Deez Nuts Joke in seconds."
          />
          <meta property="og:title" content="Twitter Deez Nuts Joke" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Twitter Deez Nuts Joke" />
          <meta
            name="twitter:description"
            content="Generate your next Twitter Deez Nuts Joke in seconds."
          />
          <meta
            property="og:image"
            content="https://deeztweets.com/23772608_0.jpg"
          />
          <meta
            name="twitter:image"
            content="https://deeztweets.com/23772608_0.jpg"
          />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
