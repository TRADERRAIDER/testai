import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function to estimate words needed for reading time
const getWordCountForReadingTime = (minutes: string) => {
  // Calibrated based on actual reading speed: 456 words = 3 minutes
  const READING_ALOUD_SPEED = 152;  // words per minute for bedtime story reading
  return Math.round(READING_ALOUD_SPEED * parseInt(minutes));
};

export async function POST(req: Request) {
  try {
    const { childName, theme, age, storyLength, requiredWords } = await req.json();
    
    const targetWordCount = getWordCountForReadingTime(storyLength);
    const requiredWordsPrompt = requiredWords 
      ? `\nRequired elements: You MUST naturally incorporate these specific words/phrases into the story: ${requiredWords}`
      : '';

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are a children's story writer creating a personalized story. Here are your guidelines:

${process.env.STORY_STYLE}

${process.env.STORY_STRUCTURE}

${process.env.CHARACTER_GUIDELINES}

${process.env.EDUCATIONAL_ELEMENTS}${requiredWordsPrompt}

Important guidelines:
- The story should be EXACTLY ${targetWordCount} words long (this is calibrated for a ${storyLength}-minute bedtime story).
- The story's message should emerge naturally through the character's experiences and choices.
- DO NOT add a separate moral at the end - the lesson should be clear from the story itself.
- While the parent is reading, ensure the vocabulary and concepts are appropriate for a ${age}-year-old child.
- Include natural pauses and moments for parent-child interaction.${requiredWords ? '\n- Ensure ALL required words/phrases are used naturally in the story.' : ''}

Now, write two things:
1. A creative, whimsical title for a children's story about ${theme} for ${childName} who is ${age} years old. The title should be engaging and magical, but no more than 8 words.

2. A short, engaging bedtime story fitting this title. The story should:
   - Feature ${childName} as the main character
   - Incorporate the theme: ${theme}
   - Be perfectly suited for a ${age}-year-old child
   - Have the moral emerge through the character's journey and choices
   - End with a satisfying conclusion that reinforces the lesson through action${requiredWords ? '\n   - Include all the required words/phrases naturally in the narrative' : ''}

Format your response exactly like this:
TITLE: [Your creative title here]
STORY: [Your story here]`
        }
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const [titlePart, storyPart] = content.split('STORY:');
    const title = titlePart.replace('TITLE:', '').trim();
    const story = storyPart.trim();

    return NextResponse.json({ story, title });
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
} 