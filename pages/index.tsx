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
    const [tweets, setTweets] = useState<ITweet[]>([]); // <-- add the ITweet interface here
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

    return (
        <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <Head>
                <title>Witty Pun Generator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
                <a
                    className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
                    href="https://github.com/Nutlope/twitterbio"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github />
                    <p>Star on GitHub</p>
                </a>
                <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
                    Generate creative witty puns as replies to tweets using chatGPT
                </h1>
                <p className="text-slate-500 mt-5">47,118 witty puns generated so far.</p>
                <div className="max-w-xl w-full">
                    <div className="mt-10">
                        <p className="font-medium">
                            Click on a tweet to generate a witty pun reply:
                        </p>
                        <ul className="space-y-4 mt-4">
                            {Array.isArray(tweets) && tweets.map((tweet) => (
                                <li key={tweet.id} className="cursor-pointer border border-gray-300 rounded-md p-4 hover:bg-gray-100">
                                    <Tweet tweet={tweet} user={tweet.user} />
                                </li>
                            ))}
                        </ul>

                    </div>
                    <div ref={replyRef} className="mt-10">
                        {selectedTweet && (
                            <>
                                <p className="font-medium mb-4">
                                    Generated witty pun reply for tweet:
                                </p>
                                <blockquote className="border-l-4 border-gray-300 pl-4 mb-4">
                                    {selectedTweet.text}
                                </blockquote>
                            </>
                        )}
                        {loading ? (
                            <LoadingDots />
                        ) : (
                            generatedReplies && (
                                <div className="border border-gray-300 rounded-md p-4 bg-white">
                                    {generatedReplies}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
            <Footer />
            <Toaster />
        </div>
    );

};

export default Home;