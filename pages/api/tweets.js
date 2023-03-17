import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

export default async function handler(req, res) {
  try {
    const tweets = await twitterClient.v2.search('imagine dragons -is:retweet', {
      expansions: 'author_id',
      'tweet.fields': 'created_at,public_metrics',
      'user.fields': 'username',
    });

    res.status(200).json({ data: tweets.data, includes: tweets.includes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tweets' });
  }
}
