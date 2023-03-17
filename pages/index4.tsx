import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import { Tweet } from "../components/Tweet.js";
interface ITweet {
    id: string;
    text: string;
}
const Home: NextPage = () => {
    const [loading, setLoading] = useState(false);
    const [tweets, setTweets] = useState({ data: [] });
    const [selectedTweet, setSelectedTweet] = useState<ITweet | null>(null); // <-- add the ITweet | null union type here
    const [generatedReplies, setGeneratedReplies] = useState("");

    const replyRef = useRef<null | HTMLDivElement>(null);

    const scrollToReplies = () => {
        if (replyRef.current !== null) {
            replyRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await fetch('/api/tweets');
                if (response.ok) {
                    const data = await response.json();
                    setTweets(data.data);
                } else {
                    throw new Error('Failed to fetch tweets');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchTweets();
    }, []);

    const generateReply = async (tweet) => {
        setSelectedTweet(tweet);
        const prompt = `Generate a creative and witty pun as a reply to the tweet: "${tweet.text}".`;
        setLoading(true);

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
            }),
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.text();
        setGeneratedReplies(data);
        scrollToReplies();
        setLoading(false);
    };

    const generateReplies = async (event, tweetId) => {
        event.preventDefault();
        const selectedTweet = tweets.data.find((t) => t.id === tweetId);
        tweetId.preventDefault();
      
        if (!selectedTweet) {
          toast("Please select a tweet first", {
            icon: "⚠️",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          return;
        }
      
        setLoading(true);
        const tweet = tweets.find((tweet) => tweet.id === selectedTweet);
        const prompt = `Suggest a creative witty pun as a reply to this tweet: "${tweet.text}"`;
      
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, maxTokens: 50, n: 5 }),
          });
      
          const data = await response.json();
          setGeneratedReplies(data.choices.map((choice) => choice.text).join('\n'));
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error(error);
          toast("Failed to generate replies", {
            icon: "⚠️",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      };

return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Generate Witty Puns</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate witty puns as replies to tweets
        </h1>
  
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Tweets</h2>
          <ul className="space-y-4">
          {tweets.data.map((tweet) => (
              <div
              key={tweet.id}
              className={`p-4 rounded-lg border-2 ${
                selectedTweet === tweet.id ? 'border-black' : 'border-gray-300'
              } cursor-pointer`}
              onClick={() => setSelectedTweet(tweet.id)}
            >
              <p>{tweet.text}</p>
            </div>
            ))}
          </ul>
        </div>
  
        {generatedReplies && (
          <div className="space-y-10 my-10">
            <div>
              <h2
                className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                ref={repliesRef}
              >
                Your generated witty puns
              </h2>
            </div>
            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              {generatedReplies
                .split("\n")
                .filter((reply) => reply.trim())
                .map((generatedReply) => {
                  return (
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedReply);
                        toast("Reply copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                      key={generatedReply}
                    >
                      <p>{generatedReply}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
  
        {!loading && (
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            onClick={(e) => generateReplies(e, tweet.id)}
          >
            Generate witty puns &rarr;
          </button>
        )}
        {loading && (
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            disabled
          >
            <LoadingDots color="white" style="large" />
          </button>
        )}
      </main>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </div>
  );

};

export default Home;