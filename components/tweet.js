// components/Tweet.js
import React from 'react';

const Tweet = ({ tweet, user }) => {
  return (
    <div className="bg-gray p-4 rounded-md shadow mb-4">
      <div className="flex">
        <img
          className="w-12 h-12 rounded-full"
          src={user.profile_image_url}
          alt={user.username}
        />
        <div className="ml-4">
          <div className="font-bold text-lg">{user.name}</div>
          <div className="text-gray-500">@{user.username}</div>
        </div>
      </div>
      <p className="mt-4">{tweet.text}</p>
      <p className="text-gray-500 text-sm mt-2">Created at: {tweet.created_at}</p>
    </div>
  );
};


export default Tweet;
