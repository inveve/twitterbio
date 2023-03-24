import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

interface TweetsResponse {
    data: {
        id: string;
        text: string;
        author_id: string;
    }[];
    includes: {
        users: {
            id: string;
            username: string;
            name: string;
        }[];
    };
}
const Home3: NextPage = () => {
    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState("");
    const [vibe, setVibe] = useState<VibeType>("Professional");
    const [generatedBios, setGeneratedBios] = useState<String>("");
    const [tweets, setTweets] = useState<TweetsResponse>({ data: [], includes: { users: [] } });
    const [selectedTweet, setSelectedTweet] = useState<String>("");
    const replyRef = useRef<null | HTMLDivElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);

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

    const bioRef = useRef<null | HTMLDivElement>(null);

    const scrollToBios = () => {
        if (bioRef.current !== null) {
            bioRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    const generateBio = async (event: any, tweet: any) => {
        if (!tweet) {
            toast.error('Please select a tweet!', {
                style: {
                    border: '1px solid black',
                    background: 'Black',
                    color: '#FFFFFF',
            },
        });
            return;
        }
        setSelectedTweet(tweet);
        event.preventDefault();
        setGeneratedBios("");
        setLoading(true);
        const promptWords = ["imagine", "dragons", "pear", "pair", "de"];
        const prompt = `Generate a creative and witty deez nuts joke as a reply to the tweet starting with "${promptWords.find(word => tweet.text.toLowerCase().includes(word.toLowerCase()))}".`;
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

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setGeneratedBios((prev) => prev + chunkValue);
        }
        scrollToBios();
        setLoading(false);
    };


    return (
        <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <Head>
                <title>Tweet Deez Generator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
                <h1 className="text-4xl max-w-[708px] font-bold text-slate-900">
                    Get them every time with a unique Deez Nutz joke.
                </h1>
                <p className="text-slate-500 mt-5">Powered by chatGPT-4</p>

                <div className="max-w-xl w-full">
                    {!loading && (
                        <button
                            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                            onClick={(event) => generateBio(event, tweets.data.find(t => t.id === selectedTweet))}
                        >
                            Generate your reply &rarr;
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
                </div>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{ duration: 2000 }}
                />
                <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
                <div className="space-y-10 my-10">
                    {generatedBios && (
                        <>
                            <div>
                                <h2
                                    className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                                    ref={bioRef}
                                >
                                    Your generated replies
                                </h2>
                            </div>
                            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                                {generatedBios
                                    .split("\n")
                                    .map((generatedBio) => {
                                        return (
                                            <div
                                                className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedBio);
                                                    toast("Tweet copied to clipboard", {
                                                        icon: "✂️",
                                                    });
                                                }}
                                                key={generatedBio}
                                            >
                                                <p>{generatedBio}</p>
                                            </div>
                                        );
                                    })}
                            </div>
                        </>
                    )}
                </div>
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Tweets</h2>
                    <div className="flex justify-center items-center w-full mt-4">
                        <button
                            onClick={() => {
                                setIsSpinning(true);
                                setTimeout(() => {
                                    setIsSpinning(false);
                                    window.location.reload();
                                }, 1000);
                            }}
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition flex items-center justify-center"
                        >
                            <span
                                className={`material-icons ${isSpinning ? 'animate-spin duration-1000 ease-in-out' : ''
                                    }`}
                            >
                                sync
                            </span>
                        </button>
                    </div>
                    <div> --</div>
                    <ul className="space-y-4">
                        {tweets.data.map((tweet) => {
                            const user = tweets.includes.users.find((u) => u.id === tweet.author_id);
                            return (
                                <div
                                    key={tweet.id}
                                    className={`p-4 rounded-lg border-2 ${selectedTweet === tweet.id ? "border-black" : "border-gray-300"
                                        } cursor-pointer bg-white`}
                                    onClick={() => setSelectedTweet(tweet.id)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <Image
                                            src='/deez-nuts.png'
                                            alt={`${user?.username} profile`}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold">{user?.name}</span>
                                            <span className="text-gray-600">@{user?.username}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2">{tweet.text}</p>
                                    <a
                                        href={`https://twitter.com/${user?.username}/status/${tweet.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-black text-white px-4 py-2 rounded-md inline-block mt-2"
                                    >
                                        View Tweet
                                    </a>
                                </div>
                            );
                        })}
                    </ul>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home3;
function setAlert(arg0: string) {
    throw new Error("Function not implemented.");
}

