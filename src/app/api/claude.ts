import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const generateStory = async (childName: string, age: string, theme: string) => {
  const prompt = `Write a short, engaging bedtime story for a ${age}-year-old child named ${childName}. 
  The story should be about ${theme}. Make it age-appropriate, educational, and fun. 
  The story should be 3-4 paragraphs long and end with a positive message.`;

  const response = await claude.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}; 