/// <reference types="react-scripts" />

declare global {
  interface Window {
    MyNamespace: {
      solana;
    };
  }
}

declare module "react-twitter-embed" {
  export function TwitterTweetEmbed({
    tweetId,
  }: {
    tweetId: string;
  }): JSX.Element;
}

window.MyNamespace = window.MyNamespace || {};
