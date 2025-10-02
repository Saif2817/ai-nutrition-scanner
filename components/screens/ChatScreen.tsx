import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ai } from '../../services/geminiService';
import { Chat } from '@google/genai';
import { ChatMessage, PlateAnalysis, UserProfile, NutritionData, GPTAnalysis } from '../../types';
import Spinner from '../ui/Spinner';
import { SendIcon, UserIcon } from '../ui/Icons';
import { AIMessageRenderer } from '../ui/AIMessageRenderer';

const generatePlateContextualSystemPrompt = (profile: UserProfile, analysis: PlateAnalysis, language: string): string => `
You are NutriScan AI, a friendly, empathetic, and expert nutrition assistant. The user has just scanned a meal and wants to ask questions about it. Your tone should be encouraging and supportive.

**USER'S HEALTH PROFILE:**
${JSON.stringify(profile, null, 2)}

**ANALYSIS OF THE SCANNED MEAL:**
${JSON.stringify(analysis, null, 2)}

Your primary goal is to answer the user's questions. Be helpful and provide actionable advice. All your responses MUST be in the user's specified language: **${language}**.

**CRITICAL FORMATTING RULES:**
You MUST use the following markdown structure. This is not optional.

1.  **Initial Analysis Breakdown:**
    *   For each key analytical point, start a new line with a prefix and the point. This is MANDATORY.
    *   Use '* WARN:' for negative points (e.g., high calories, unhealthy fats, conflicts with health conditions, doesn't align with preferences).
    *   Use '* INFO:' for neutral, informational points (e.g., explaining how it affects a condition like PCOS, or highlighting allergy risks).
    *   Use '* GOOD:' for any positive points about the meal.
    *   Example: * WARN: Very High Calories: With 1705 calories, this meal alone provides a significant portion of daily caloric needs...
    *   Example: * INFO: PCOS Management: The high glycemic load from refined carbs can worsen insulin resistance...

2.  **Healthier Alternatives / Suggestions:**
    *   Start the entire section with a main header: '### Healthier Alternatives'.
    *   Follow it with a brief introductory sentence.
    *   For EACH individual suggestion, use a numbered sub-header: '#### 1. Nutrient-Dense Grain & Lentil Bowls'.
    *   After the title, provide a one-sentence description.
    *   Then, provide a personalized explanation starting EXACTLY with '**Why it's better for you:**'. In this section, you MUST reference the user's specific profile data (e.g., "This option drastically reduces refined carbs and unhealthy fats, making it excellent for managing your Type 2 Diabetes...").
    *   Use '* Category:*' for sub-sections like '* Grain Base:*', '* Protein:*', '* Vegetables:*'. Use a single asterisk.
    *   Use '**text**' for bolding important words.

3.  **Important Notes / Disclaimers:**
    *   For critical warnings or disclaimers, wrap the entire note in underscores, like '_IMPORTANT NOTE: Your note here._'.

**PERSONALIZATION INSTRUCTIONS:**
- You MUST consider the user's 'cookingSkills' and 'cookingTime' from their profile. If they are a 'Beginner' with '< 15 mins' cooking time, suggest extremely simple, quick meals. If they are an 'Expert', you can suggest more complex ideas. Explicitly mention this in your reasoning, for example: "Since your profile indicates you have Expert cooking skills, we can explore...".

**MEDICAL DISCLAIMER:**
Do not provide medical advice. If asked about medical conditions, advise the user to consult a healthcare professional.
`;

const generateLabelContextualSystemPrompt = (profile: UserProfile, analysis: { nutritionData: NutritionData, gptAnalysis: GPTAnalysis }, language: string): string => `
You are NutriScan AI, a friendly, empathetic, and expert nutrition assistant. The user has just scanned a food label and wants to ask questions. Your tone should be encouraging and supportive.

**USER'S HEALTH PROFILE:**
${JSON.stringify(profile, null, 2)}

**ANALYSIS OF THE SCANNED LABEL:**
${JSON.stringify(analysis, null, 2)}

Your primary goal is to answer the user's questions. Be helpful and provide actionable advice. All your responses MUST be in the user's specified language: **${language}**.

**CRITICAL FORMATTING RULES:**
You MUST use the following markdown structure. This is not optional.

1.  **Initial Analysis Breakdown:**
    *   For each key analytical point (like why a food is not recommended), start a new line with a prefix and the point. This is MANDATORY.
    *   Use '* WARN:' for negative points (e.g., high sugar, high sodium).
    *   Use '* INFO:' for neutral, informational points (e.g., presence of additives).
    *   Use '* GOOD:' for positive points.
    *   Example: * WARN: High Sugar Content: This ketchup is high in sugar...
    *   Example: * WARN: High Sodium Content: With 142mg of sodium...
    *   Example: * INFO: Processed Additives: It contains preservatives...

2.  **Smarter Swaps / Suggestions:**
    *   Start the entire section with a main header, like '### Smarter Swaps for Condiments'.
    *   Follow it with a brief introductory sentence.
    *   For EACH individual suggestion, use a sub-header: '#### Homemade Sugar-Free Ketchup'.
    *   After the title, provide a one-sentence description.
    *   Then, provide a personalized explanation starting EXACTLY with '**Why it's better for you:**'. In this section, you MUST reference the user's specific profile data (e.g., "This aligns with your Low Sodium preference and Diabetes Control goal.").
    *   Use '*' for bullet points to list ingredients or steps if needed.
    *   Use '**text**' for bolding important words.

3.  **Important Notes / Disclaimers:**
    *   For critical warnings or disclaimers, wrap the entire note in underscores, like '_IMPORTANT NOTE: Always consult with your doctor..._'.

**PERSONALIZATION INSTRUCTIONS:**
- You MUST consider the user's 'cookingSkills' from their profile when making suggestions. For instance, "Since you have intermediate cooking skills, you could try making your own..."

**MEDICAL DISCLAIMER:**
Do not provide medical advice. If asked about medical conditions, advise the user to consult a healthcare professional.
`;


const ChatScreen: React.FC = () => {
    const { chatHistory, addChatMessage, setChatHistory, profile, chatContext, setChatContext } = useAppContext();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<Chat | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [chatHistory]);

    // Setup chat session on mount
    useEffect(() => {
        if (!profile) return;

        let systemInstruction: string | undefined;
        let initialMessage: ChatMessage | undefined;

        if (chatContext) {
            // Contextual chat about a specific scan result
            if (chatContext.scanType === 'plate' && chatContext.plateAnalysis) {
                systemInstruction = generatePlateContextualSystemPrompt(profile, chatContext.plateAnalysis, profile.language);
                initialMessage = {
                    id: new Date().toISOString(),
                    sender: 'ai',
                    text: `I've analyzed your meal which has about ${Math.round(chatContext.plateAnalysis.totalCalories)} calories. What would you like to know about it?`,
                    timestamp: new Date().toLocaleString(),
                };
            } else if (chatContext.scanType === 'label' && chatContext.nutritionData && chatContext.gptAnalysis) {
                systemInstruction = generateLabelContextualSystemPrompt(profile, { nutritionData: chatContext.nutritionData, gptAnalysis: chatContext.gptAnalysis }, profile.language);
                const productName = chatContext.nutritionData.productName || "the scanned product";
                initialMessage = {
                    id: new Date().toISOString(),
                    sender: 'ai',
                    text: `Hello ${profile.name || 'there'}, I have analyzed the ${productName} label. What would you like to know about it?`,
                    timestamp: new Date().toLocaleString(),
                };
            }
        } 
        
        if (!systemInstruction) {
            // Generic chat session
            let greeting = `Hi ${profile.name || 'there'}! I'm NutriScan AI. `;
            if (profile.healthGoals && profile.healthGoals.length > 0) {
                greeting += `I see your goal is ${profile.healthGoals[0]}. How can I help you today?`;
            } else {
                greeting += 'How can I help you with your nutrition questions today?';
            }
            
            systemInstruction = `You are NutriScan AI, a friendly and knowledgeable nutrition assistant. Your goal is to answer questions about nutrition, health, and food products accurately and concisely in the user's preferred language, which is ${profile.language}. Do not provide medical advice. If asked about medical conditions, advise the user to consult a healthcare professional.`;
            
            // Only set initial message if history is empty (and no context was provided)
            if(chatHistory.length === 0) {
                 initialMessage = {
                    id: new Date().toISOString(),
                    sender: 'ai',
                    text: greeting,
                    timestamp: new Date().toLocaleString(),
                };
            }
        }
        
        if (initialMessage) {
            setChatHistory([initialMessage]);
        }
        
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        setChat(newChat);

    }, [profile, chatContext]);

    // Cleanup context on unmount
    useEffect(() => {
        return () => {
            setChatContext(null);
        };
    }, [setChatContext]);


    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chat) return;

        const userMessage: ChatMessage = {
            id: new Date().toISOString(),
            sender: 'user',
            text: input,
            timestamp: new Date().toLocaleString(),
        };
        addChatMessage(userMessage);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: currentInput });
            const aiMessage: ChatMessage = {
                id: new Date().toISOString() + '-ai',
                sender: 'ai',
                text: response.text,
                timestamp: new Date().toLocaleString(),
            };
            addChatMessage(aiMessage);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: new Date().toISOString() + '-error',
                sender: 'ai',
                text: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toLocaleString(),
            };
            addChatMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.sender === 'ai' && (
                           <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">AI</span>
                           </div>
                        )}
                        <div
                            className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                                msg.sender === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                            }`}
                        >
                           {msg.sender === 'ai' ? (
                                <AIMessageRenderer text={msg.text} />
                            ) : (
                                <p className="text-sm">{msg.text}</p>
                            )}
                        </div>
                         {msg.sender === 'user' && (
                           <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                               <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                           </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none">
                            <Spinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a nutrition question..."
                    className="flex-grow w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || input.trim() === ''}
                    className="p-3 bg-green-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatScreen;