// components/TweetWithReply.js
import React, { useState } from 'react';
import Tweet from './tweet.js';

const API_URL = '/api/streamgpt.ts';

const TweetWithReply = ({ tweet, user }) => {
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweet: tweet.text }),
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (error) {
      console.error('Error generating reply:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray rounded-lg p-4 mb-4 shadow">
      <Tweet tweet={tweet} user={user} />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        onClick={handleReply}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Reply'}
      </button>
      {reply && (
        <div className="bg-gray-100 rounded-lg p-4 mt-4">
          <p className="font-bold">Witty reply:</p>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
};

export default TweetWithReply;
