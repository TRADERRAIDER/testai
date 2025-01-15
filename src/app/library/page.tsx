"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SavedStory {
  id: string;
  childName: string;
  age: string;
  theme: string;
  story: string;
  date: string;
  title: string;
}

export default function Library() {
  const [stories, setStories] = useState<SavedStory[]>([]);

  useEffect(() => {
    const savedStories = localStorage.getItem("stories");
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    }
  }, []);

  const deleteStory = (id: string) => {
    const updatedStories = stories.filter(story => story.id !== id);
    setStories(updatedStories);
    localStorage.setItem("stories", JSON.stringify(updatedStories));
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold flex items-center">
          <span className="text-red-500">S</span>
          <span className="text-orange-500">t</span>
          <span className="text-yellow-500">o</span>
          <span className="text-green-500">r</span>
          <span className="text-teal-500">y</span>
          <span className="mx-2" />
          <span className="text-blue-500">L</span>
          <span className="text-indigo-500">i</span>
          <span className="text-violet-500">b</span>
          <span className="text-purple-500">r</span>
          <span className="text-pink-500">a</span>
          <span className="text-rose-500">r</span>
          <span className="text-red-500">y</span>
          <span className="text-amber-400">✨</span>
        </h1>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Story
        </Link>
      </div>

      <div className="space-y-6">
        {stories.length === 0 ? (
          <p className="text-center text-gray-500">No stories saved yet.</p>
        ) : (
          stories.map((story) => (
            <div key={story.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{story.title || `Story for ${story.childName}`}</h2>
                  <p className="text-sm text-gray-500">Age: {story.age} • Created: {story.date}</p>
                </div>
                <button
                  onClick={() => deleteStory(story.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Theme:</h3>
                <p className="text-gray-700">{story.theme}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Story:</h3>
                <div className="prose max-w-none whitespace-pre-wrap">
                  {story.story}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
} 