
import { AudioContent, ChatMessage, GroundingChunk, GroundingMetadata } from './types';
import { MOCK_AUDIO_FILES, GEMINI_API_KEY_INFO, GEMINI_TEXT_MODEL } from './constants';
import { GoogleGenAI, GenerateContentResponse, Part } from '@google/genai'; // Ensure this matches actual library exports

// Simulate API_KEY for demonstration purposes. In a real app, this would be securely managed.
const MOCK_API_KEY = "YOUR_GEMINI_API_KEY_ENV_VAR"; // process.env.API_KEY would be used here.
// console.log(`Gemini Service initialized (mock). API Key ENV VAR: ${GEMINI_API_KEY_INFO}`);


// This is a MOCK implementation. A real implementation would use:
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 
// For the purpose of this mockup, we are not making actual API calls.

const simulateDelay = <T,>(data: T, delay: number = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const getAIRecommendations = async (userId: string): Promise<AudioContent[]> => {
  console.log(`Mock Gemini: Fetching AI recommendations for user ${userId} using model ${GEMINI_TEXT_MODEL}.`);
  // In a real scenario, you'd construct a prompt based on user's listening history, preferences etc.
  // const prompt = `Recommend 3 audio sessions for a user who likes ${userPreferences}. Format as JSON list of titles.`;
  // const response: GenerateContentResponse = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json" }});
  // const parsedRecommendations = JSON.parse(response.text); // And map to AudioContent[]

  // Mocked response:
  const recommendations = MOCK_AUDIO_FILES.slice(0, 3).map(audio => ({ ...audio, title: `${audio.title} (AI Rec)` }));
  return simulateDelay(recommendations, 800);
};

export const getPrescriptionBasedOnDiagnosis = async (answers: Record<string, any>): Promise<AudioContent> => {
  console.log(`Mock Gemini: Generating prescription based on diagnosis:`, answers, `using model ${GEMINI_TEXT_MODEL}.`);
  // const prompt = `User diagnosis: ${JSON.stringify(answers)}. Recommend one specific audio session. Respond with JSON: {"title": "Session Title", "reason": "Why this session"}.`;
  // const response: GenerateContentResponse = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json"} });
  // const prescriptionData = JSON.parse(response.text.replace(/\`\`\`json\n?|\n?\`\`\`/g, '').trim());
  // const foundAudio = MOCK_AUDIO_FILES.find(a => a.title.includes(prescriptionData.title.split(' ')[0])) || MOCK_AUDIO_FILES[0];
  
  // Mocked response:
  const prescribedAudio = { ...MOCK_AUDIO_FILES[Math.floor(Math.random() * MOCK_AUDIO_FILES.length)], title: "Personalized Relaxation Mix" };
  return simulateDelay(prescribedAudio, 1200);
};

interface MockGenerateContentResponse {
    text: string;
    candidates?: {
        groundingMetadata?: GroundingMetadata;
    }[];
}


export const chatWithAIAssistant = async (history: ChatMessage[], newMessage: string): Promise<{ aiResponse: ChatMessage, groundingMetadata?: GroundingMetadata }> => {
  console.log(`Mock Gemini: Chatting with AI assistant. New message: "${newMessage}" using model ${GEMINI_TEXT_MODEL}.`);
  // const formattedHistory = history.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
  // const contents = [...formattedHistory, { role: 'user', parts: [{ text: newMessage }] }];
  // const chat = ai.chats.create({ model: GEMINI_TEXT_MODEL, history: formattedHistory});
  // const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
  // const aiText = response.text;
  // const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

  // Mocked response:
  let aiText = "I'm processing your request... ";
  const groundingChunks: GroundingChunk[] = [];

  if (newMessage.toLowerCase().includes("sleep")) {
    aiText = "For sleep, I recommend 'Deep Sleep Waves'. It's very popular!";
  } else if (newMessage.toLowerCase().includes("reminder")) {
    aiText = "Okay, I can help set a reminder. Which audio and for what time?";
  } else if (newMessage.toLowerCase().includes("feeling anxious")) {
    aiText = "I'm sorry to hear you're feeling anxious. 'Anxiety Release Ambient' might help you find some calm.";
  } else if (newMessage.toLowerCase().includes("who won") && newMessage.toLowerCase().includes("olympics")) {
    aiText = "According to my sources, the most decorated athlete was Jane Doe with 5 gold medals in swimming. For more details, check the official Olympics website.";
    groundingChunks.push({ web: { uri: "https://olympics.com/paris-2024/en/results", title: "Official Paris 2024 Olympic Results" }});
    groundingChunks.push({ web: { uri: "https://en.wikipedia.org/wiki/2024_Summer_Olympics_medal_table", title: "2024 Summer Olympics medal table - Wikipedia" }});
  } else {
    aiText = `I received your message: "${newMessage}". How else can I assist you today?`;
  }
  
  const aiMessage: ChatMessage = {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: aiText,
    timestamp: new Date(),
  };

  const groundingMetadata: GroundingMetadata | undefined = groundingChunks.length > 0 ? { groundingChunks } : undefined;

  return simulateDelay({ aiResponse: aiMessage, groundingMetadata }, 700);
};

// Mock function for image generation (not used in current UI but good to have as per guidelines)
export const generateImageMock = async (prompt: string): Promise<string> => {
    // const response = await ai.models.generateImages({ model: 'imagen-3.0-generate-002', prompt: prompt, config: {numberOfImages: 1, outputMimeType: 'image/jpeg'} });
    // const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    // return `data:image/jpeg;base64,${base64ImageBytes}`;
    console.log(`Mock Gemini: Generating image for prompt "${prompt}"`);
    // Return a placeholder image URL
    return simulateDelay(`https://picsum.photos/seed/${encodeURIComponent(prompt)}/512/512`, 1500);
};

// Example function showing how to parse JSON from Gemini response
export const getStructuredDataFromGemini = async <T,>(prompt: string): Promise<T | null> => {
    console.log(`Mock Gemini: Fetching structured data for prompt: "${prompt}" using model ${GEMINI_TEXT_MODEL}. Expecting JSON output.`);
    // In a real scenario:
    // const response = await ai.models.generateContent({
    //   model: GEMINI_TEXT_MODEL,
    //   contents: prompt,
    //   config: { responseMimeType: "application/json" },
    // });
    // let jsonStr = response.text.trim();
    // const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Adjusted regex
    // const match = jsonStr.match(fenceRegex);
    // if (match && match[2]) {
    //   jsonStr = match[2].trim();
    // }
    // try {
    //   return JSON.parse(jsonStr) as T;
    // } catch (e) {
    //   console.error("Failed to parse JSON response:", e, "Raw text:", response.text);
    //   return null;
    // }

    // Mocked response:
    if (prompt.includes("user profile details")) {
        const mockData = { name: "John Doe", preferences: ["meditation", "sleep stories"], lastSession: "Morning Dew Meditation" };
        return simulateDelay(mockData as T, 600);
    }
    return simulateDelay(null, 600);
};


// Example of how to use GoogleGenAI (mocked, not making real calls)
class MockGoogleGenAI {
    apiKey: string;
    constructor(config: { apiKey: string }) {
        this.apiKey = config.apiKey;
        if (!this.apiKey) {
            console.warn("MockGoogleGenAI: API Key is missing in constructor config.");
        }
    }

    get models() {
        return {
            generateContent: async (params: { model: string; contents: string | Part | {parts: Part[]}; config?: any }): Promise<MockGenerateContentResponse> => {
                console.log(`Mock ai.models.generateContent called with model: ${params.model}`);
                // Simple mock based on content
                let text = "This is a mock response from generateContent.";
                if (typeof params.contents === 'string' && params.contents.toLowerCase().includes("hello")) {
                    text = "Hello there! This is a mock greeting.";
                }
                
                const response: MockGenerateContentResponse = { text };
                
                if (params.config?.tools?.some((tool: any) => tool.googleSearch)) {
                    text += " Mocked Google Search results would appear here.";
                    response.candidates = [{
                        groundingMetadata: {
                            groundingChunks: [
                                { web: { uri: "https://mocksearch.com/result1", title: "Mock Search Result 1" }},
                                { web: { uri: "https://mocksearch.com/result2", title: "Mock Search Result 2" }}
                            ]
                        }
                    }];
                }

                if(params.config?.responseMimeType === "application/json"){
                    text = JSON.stringify({ message: text, mockData: true });
                    if(params.contents === "Tell me a story in 100 words."){ // specific test case
                         text = "```json\n{\"story\": \"Once upon a time, in a mock land...\"}\n```";
                    }
                }
                
                response.text = text;
                return simulateDelay(response);
            },
            generateContentStream: async function* (params: { model: string; contents: string | Part | {parts: Part[]}; config?: any }) {
                console.log(`Mock ai.models.generateContentStream called with model: ${params.model}`);
                const text = "This is a mock streaming response. Chunk 1. Chunk 2. Chunk 3.";
                const chunks = text.split(". ");
                for (const chunkText of chunks) {
                    if (chunkText) {
                        await simulateDelay(null, 100); // Simulate network latency for each chunk
                        yield { text: chunkText + "." };
                    }
                }
            },
             generateImages: async (params: {model: string; prompt: string; config?: any}) => {
                console.log(`Mock ai.models.generateImages called with model: ${params.model} and prompt: ${params.prompt}`);
                const mockBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // 1x1 red pixel
                return simulateDelay({
                    generatedImages: [{ image: { imageBytes: mockBase64, mimeType: params.config?.outputMimeType || 'image/png' } }]
                });
            }
        };
    }
    
    get chats() {
        const self = this; // Capture 'this' from MockGoogleGenAI instance
        return {
            create: (params: { model: string; history?: any[]; config?: any }) => {
                console.log(`Mock ai.chats.create called with model: ${params.model}`);
                let currentHistory = params.history || [];
                return {
                    sendMessage: async (messageParams: { message: string }): Promise<MockGenerateContentResponse> => {
                        console.log(`Mock chat.sendMessage called with message: ${messageParams.message}`);
                        currentHistory.push({ role: 'user', parts: [{ text: messageParams.message }] });
                        const aiText = `Mock AI response to: "${messageParams.message}". History length: ${currentHistory.length}`;
                        currentHistory.push({ role: 'model', parts: [{ text: aiText }] });
                        return simulateDelay({ text: aiText });
                    },
                    sendMessageStream: async function* (messageParams: { message: string }) {
                        console.log(`Mock chat.sendMessageStream called with message: ${messageParams.message}`);
                        currentHistory.push({ role: 'user', parts: [{ text: messageParams.message }] });
                        const text = `Mock streaming AI response to: "${messageParams.message}". Chunk 1. Chunk 2.`;
                        currentHistory.push({ role: 'model', parts: [{ text }] }); // Add whole response for history simplicity
                        const chunks = text.split(". ");
                        for (const chunkText of chunks) {
                             if (chunkText) {
                                await simulateDelay(null, 100);
                                yield { text: chunkText + "." };
                            }
                        }
                    }
                };
            }
        };
    }
}

// Instantiate the mock AI client if needed for testing service functions internally
// This is NOT how real @google/genai works, but helps simulate the structure for mocks.
const mockAiInstance = new MockGoogleGenAI({ apiKey: MOCK_API_KEY });

// Example of using the mock instance for testing a specific call structure.
export const testMockGoogleSearch = async () => {
    return mockAiInstance.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: "What's the weather like with Google Search?",
        config: { tools: [{ googleSearch: {} }] }
    });
};
