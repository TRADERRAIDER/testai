"use client";

import { useState } from "react";
import { Send, Save, Library } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [childName, setChildName] = useState("");
  const [theme, setTheme] = useState("");
  const [age, setAge] = useState("");
  const [storyLength, setStoryLength] = useState("3");
  const [requiredWords, setRequiredWords] = useState("");
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const generateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveMessage("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ childName, theme, age, storyLength, requiredWords }),
      });
      const data = await response.json();
      setStory(data.story);
      setTitle(data.title);
    } catch (error) {
      console.error("Error generating story:", error);
    }
    setLoading(false);
  };

  const saveStory = () => {
    const savedStories = JSON.parse(localStorage.getItem("stories") || "[]");
    const newStory = {
      id: Date.now().toString(),
      childName,
      age,
      theme,
      story,
      title,
      storyLength,
      requiredWords,
      date: new Date().toLocaleDateString(),
    };
    savedStories.push(newStory);
    localStorage.setItem("stories", JSON.stringify(savedStories));
    setSaveMessage(`"${title}" saved to your library! ✨`);
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold flex items-center">
          <span className="text-red-500">O</span>
          <span className="text-orange-500">n</span>
          <span className="text-yellow-500">c</span>
          <span className="text-green-500">e</span>
          <span className="mx-2" />
          <span className="text-teal-500">U</span>
          <span className="text-blue-500">p</span>
          <span className="text-indigo-500">o</span>
          <span className="text-purple-500">n</span>
          <span className="mx-2" />
          <span className="text-pink-500">A</span>
          <span className="text-rose-500">I</span>
          <span className="text-amber-400">✨</span>
        </h1>
        <Link
          href="/library"
          className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          <Library className="w-4 h-4" />
          View Library
        </Link>
      </div>
      <div className="space-y-8">
        <form onSubmit={generateStory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Child's Name</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your child's name (e.g., Emma, Liam)"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select age...</option>
              {[3, 4, 5, 6, 7, 8, 9, 10].map((age) => (
                <option key={age} value={age}>
                  {age} years old
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reading Time</label>
            <select
              value={storyLength}
              onChange={(e) => setStoryLength(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              {[3, 4, 5, 6, 7, 8].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Story Theme</label>
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Describe the story theme or elements you'd like to include (e.g., 'A magical adventure about friendship with a dragon and a unicorn')"
              className="w-full p-2 border rounded-md resize-none"
              rows={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Special Words or Phrases
              <span className="text-gray-500 text-xs ml-2">(Optional)</span>
            </label>
            <textarea
              value={requiredWords}
              onChange={(e) => setRequiredWords(e.target.value)}
              placeholder="Add specific words or phrases you'd like included in the story (e.g., 'chocolate chip cookies, grandma's garden, yellow butterfly'). Separate multiple items with commas."
              className="w-full p-2 border rounded-md resize-none"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            {loading ? "Generating..." : "Generate Story"} <Send className="w-4 h-4" />
          </button>
        </form>

        {story && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <button
                  onClick={saveStory}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Save Story
                </button>
              </div>
              {saveMessage && (
                <p className="text-green-600 text-sm animate-fade-in">
                  {saveMessage}
                </p>
              )}
            </div>
            <div className="prose max-w-none whitespace-pre-wrap text-gray-900 mt-4">{story}</div>
          </div>
        )}
      </div>
    </main>
  );
}
