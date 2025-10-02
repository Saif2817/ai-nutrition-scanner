import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserProfile, NutritionData, GPTAnalysis, PlateAnalysis, MealPlan, MealItem, MealIngredient, MealSwapSuggestion } from "../types";

// FIX: Initialize and export the GoogleGenAI client.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const gptAnalysisSchemaProperties = {
    summary: { type: Type.STRING, description: "A concise, one-paragraph summary of the product's healthiness for the user. Incorporate serving size for context." },
    positivePoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bullet points on the good aspects of this product." },
    negativePoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bullet points on the negative aspects or things to watch out for." },
    dietaryCompliance: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                preference: { type: Type.STRING },
                compliant: { type: Type.BOOLEAN },
                reason: { type: Type.STRING, description: "Explain why it is or isn't compliant." }
            },
            required: ["preference", "compliant", "reason"]
        },
        description: "Analysis of how this product aligns with the user's dietary preferences."
    },
    drugNutrientInteractions: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                medication: { type: Type.STRING },
                interactingIngredient: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
                explanation: { type: Type.STRING }
            },
            required: ["medication", "interactingIngredient", "severity", "explanation"]
        },
        description: "Potential interactions between the user's medications and the product's ingredients."
    },
    recallInfo: {
        type: Type.OBJECT,
        properties: {
            isRecalled: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Reason for recall if applicable." },
            officialSource: { type: Type.STRING, description: "A valid, clickable URL to the official source if a recall is found." }
        },
        required: ["isRecalled"],
        description: "Check for recent safety recalls. This should be based on a simulated search of public data. Do not invent recalls."
    },
    glycemicImpact: {
        type: Type.OBJECT,
        description: "Analyze the product's likely effect on blood sugar levels.",
        properties: {
            level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            reasoning: { type: Type.STRING, description: "Explain why the glycemic impact is at this level." }
        },
    },
    contextualNotes: {
        type: Type.ARRAY,
        description: "Crucial context for the user's specific health conditions that may not be obvious from the label.",
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "A short, clear title for the note (e.g., 'Note for CKD Management')." },
                note: { type: Type.STRING, description: "The detailed contextual note (e.g., 'This label does not list Potassium or Phosphorus levels, which are important to monitor.')." }
            },
            required: ["title", "note"]
        }
    },
    mealPairingSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Specific, healthy food pairings to complement the product or mitigate its negative aspects."
    },
    timeOfDayRecommendation: {
        type: Type.STRING,
        description: "Suggest the best time of day to eat this product (e.g., 'Best as a pre-workout snack')."
    },
    smarterSwaps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List 2-3 healthier alternative product types the user could consider."
    },
    personalizedScore: {
        type: Type.OBJECT,
        description: "A single, personalized score from 1-10 representing how well this product aligns with the user's overall health profile and goals.",
        properties: {
            score: { type: Type.INTEGER, description: "An integer score from 1 (very poor fit) to 10 (excellent fit)." },
            rationale: { type: Type.STRING, description: "A concise, one-sentence explanation for the score, highlighting the key deciding factors (e.g., 'Scores moderately due to high GI for diabetes, despite being low-sodium.')." }
        },
    },
    portioningGuidance: {
        type: Type.OBJECT,
        description: "Quantitative, actionable advice on portion sizes for the user's specific conditions.",
        properties: {
            title: { type: Type.STRING, description: "A short, clear title (e.g., 'Portion Control for Diabetes')." },
            guidance: { type: Type.STRING, description: "The detailed guidance. For a diabetic user, use a 45g carb/meal guideline to provide context. E.g., 'A serving of 2-3 cakes (12-18g carbs) is a reasonable snack, but 7 or more would be a full meal's worth of carbs.'" }
        },
    },
    flaggedIngredients: {
        type: Type.ARRAY,
        description: "A list of specific ingredients from the product that are noteworthy for the user's profile.",
        items: {
            type: Type.OBJECT,
            properties: {
                ingredient: { type: Type.STRING, description: "The name of the ingredient as listed." },
                flag: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'], description: "Mark as 'positive' (beneficial), 'negative' (concerning), or 'neutral' (informational)." },
                reason: { type: Type.STRING, description: "A very brief explanation for the flag (e.g., 'High GI', 'Good source of fiber')." }
            },
            required: ["ingredient", "flag", "reason"]
        }
    }
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        nutritionData: {
            type: Type.OBJECT,
            properties: {
                productName: { type: Type.STRING, description: "The full name of the product." },
                nutritionFacts: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.STRING },
                            dailyValue: { type: Type.STRING, description: "Percentage of Daily Value, e.g., '15%'"},
                            riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'INFO'], description: "Risk level for this nutrient based on general guidelines and user profile. E.g., Sodium might be HIGH."}
                        },
                        required: ["name", "value"]
                    }
                },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                allergens: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of allergens explicitly mentioned, usually in bold." },
            },
            required: ["productName", "nutritionFacts", "ingredients"]
        },
        gptAnalysis: {
            type: Type.OBJECT,
            properties: gptAnalysisSchemaProperties,
            required: ["summary", "positivePoints", "negativePoints", "dietaryCompliance", "drugNutrientInteractions", "recallInfo"]
        }
    },
    required: ["nutritionData", "gptAnalysis"]
};

const plateAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A concise paragraph evaluating the meal's suitability for the user." },
        totalCalories: { type: Type.NUMBER, description: "The total estimated calories for the entire meal." },
        totalMacros: {
            type: Type.OBJECT,
            properties: {
                proteinGrams: { type: Type.NUMBER },
                carbohydratesGrams: { type: Type.NUMBER },
                fatGrams: { type: Type.NUMBER }
            },
            required: ["proteinGrams", "carbohydratesGrams", "fatGrams"]
        },
        foodItems: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the identified food item." },
                    quantity: { type: Type.STRING, description: "Estimated quantity in grams or common household measures (e.g., '1 cup cooked rice', '150g salmon fillet'). For small items, provide a precise count (e.g., '4 almonds', '1 dried fig')." },
                    calories: { type: Type.NUMBER },
                    confidenceScore: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 reflecting certainty in identification and estimation. Lower this score if counting clustered items was difficult." },
                    macros: {
                        type: Type.OBJECT,
                        properties: {
                            proteinGrams: { type: Type.NUMBER },
                            carbohydratesGrams: { type: Type.NUMBER },
                            fatGrams: { type: Type.NUMBER }
                        },
                        required: ["proteinGrams", "carbohydratesGrams", "fatGrams"]
                    }
                },
                required: ["name", "quantity", "calories", "confidenceScore", "macros"]
            }
        },
        personalizedFeedback: {
            type: Type.OBJECT,
            properties: {
                positivePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                negativePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                portioningGuidance: { type: Type.STRING, description: "Actionable advice on whether the portion size is appropriate." },
                healthierSwaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                dietaryCompliance: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            preference: { type: Type.STRING },
                            compliant: { type: Type.BOOLEAN },
                            reason: { type: Type.STRING, description: "Explain why it is or isn't compliant." }
                        },
                        required: ["preference", "compliant", "reason"]
                    },
                }
            },
            required: ["positivePoints", "negativePoints", "dietaryCompliance"]
        },
        mealScore: { type: Type.NUMBER, description: "A holistic score from 1-10 on how healthy this meal is for the user. 1-3 is poor, 4-7 is moderate, 8-10 is good." },
        scoreRationale: { type: Type.STRING, description: "A short, one-sentence explanation for the meal score." },
        scoreColor: { type: Type.STRING, enum: ['red', 'yellow', 'green'], description: "Color code based on the meal score: red (1-3), yellow (4-7), green (8-10)." },
        mealCategory: { type: Type.STRING, description: "Categorize the meal as 'Breakfast', 'Lunch', 'Dinner', 'Snack', or 'Unknown'." },
    },
    required: ["summary", "totalCalories", "totalMacros", "foodItems", "personalizedFeedback", "mealScore", "scoreRationale", "scoreColor", "mealCategory"]
};

const profileExtractionSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The user's full name if found." },
        dob: { type: Type.STRING, description: "The user's date of birth in YYYY-MM-DD format if found." },
        gender: { type: Type.STRING, enum: ['Male', 'Female', 'Other'], description: "The user's gender if explicitly mentioned." },
        location: {
            type: Type.OBJECT,
            properties: {
                state: { type: Type.STRING, description: "The user's state of residence if found." },
                city: { type: Type.STRING, description: "The user's city or district if found." }
            },
            description: "The user's location if found."
        },
        healthConditions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of medical conditions mentioned in the document." },
        allergies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of allergies mentioned in the document." },
        intolerances: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of intolerances mentioned in the document." },
        medications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of current medications mentioned in the document." }
    },
};

const shoppingSuggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        category: { 
            type: Type.STRING, 
            description: "The most appropriate grocery store category for this item.",
            enum: ['Produce', 'Protein', 'Dairy', 'Bakery', 'Pantry', 'Frozen', 'Beverages', 'Household', 'Other']
        },
        seasonalAlternatives: {
            type: Type.ARRAY,
            description: "A list of 2-3 seasonal, healthier, or more cost-effective alternatives.",
            items: {
                type: Type.OBJECT,
                properties: {
                    alternative: { type: Type.STRING, description: "The name of the alternative item." },
                    reason: { type: Type.STRING, description: "A brief, one-sentence explanation of why this is a good alternative (e.g., 'Currently in season and cheaper', 'Lower in sugar and higher in fiber')." }
                },
                required: ["alternative", "reason"]
            }
        }
    },
    required: ["category", "seasonalAlternatives"]
};


const mealItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the meal item." },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    weightGrams: { type: Type.NUMBER, description: "Pre-cooked weight in grams." },
                    notes: {
                        type: Type.ARRAY,
                        description: "Optional notes for this ingredient, such as clinical alerts or sourcing tips.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['alert', 'info', 'interaction'] },
                                text: { type: Type.STRING }
                            },
                            required: ["type", "text"]
                        }
                    }
                },
                required: ["name", "weightGrams"]
            }
        },
        macros: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.NUMBER },
                proteinGrams: { type: Type.NUMBER },
                carbsGrams: { type: Type.NUMBER },
                fatGrams: { type: Type.NUMBER }
            },
            required: ["calories", "proteinGrams", "carbsGrams", "fatGrams"]
        },
        recipe: { type: Type.STRING, description: "Simple, step-by-step preparation instructions." },
        glycemicInfo: {
            type: Type.OBJECT,
            properties: {
                index: { type: Type.NUMBER, description: "Estimated Glycemic Index (GI), if applicable." },
                load: { type: Type.NUMBER, description: "Calculated Glycemic Load (GL) for the entire meal. This is a more accurate measure of blood sugar impact." },
                explanation: { type: Type.STRING, description: "Brief explanation of the glycemic impact for the user." }
            },
            required: ["load", "explanation"]
        }
    },
    required: ["name", "ingredients", "macros", "recipe", "glycemicInfo"]
};

// Helper function to get meal labels based on frequency
const getMealLabelsForFrequency = (frequency?: number): string[] => {
    switch (frequency) {
        case 2: return ['🥞 Breakfast', '🍲 Dinner'];
        case 3: return ['🥞 Breakfast', '🍛 Lunch', '🍲 Dinner'];
        case 5: return ['🥞 Breakfast', '🍎 Mid-Morning Snack', '🍛 Lunch', '🌽 Evening Snack', '🍲 Dinner'];
        case 6: return ['🍵 Early Morning', '🥞 Breakfast', '🍎 Mid-Morning Snack', '🍛 Lunch', '🌽 Evening Snack', '🍲 Dinner'];
        case 4:
        default:
            return ['🥞 Breakfast', '🍛 Lunch', '🌽 Evening Snack', '🍲 Dinner'];
    }
};

const generateDynamicMealPlanSchema = (profile: UserProfile) => {
    const mealLabels = getMealLabelsForFrequency(profile.preferredMealFrequency);
    const mealsSchemaProperties = mealLabels.reduce((acc, label) => {
        acc[label] = mealItemSchema;
        return acc;
    }, {} as Record<string, any>);

    return {
        type: Type.OBJECT,
        properties: {
            planSummary: { type: Type.STRING, description: "A brief, encouraging summary of the 7-day meal plan." },
            dailyPlans: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.STRING, description: "The day of the week (e.g., 'Monday')." },
                        meals: {
                            type: Type.OBJECT,
                            properties: mealsSchemaProperties,
                            required: mealLabels
                        },
                        dailyTotals: {
                            type: Type.OBJECT,
                            properties: {
                                calories: { type: Type.NUMBER },
                                proteinGrams: { type: Type.NUMBER },
                                carbsGrams: { type: Type.NUMBER },
                                fatGrams: { type: Type.NUMBER }
                            },
                            required: ["calories", "proteinGrams", "carbsGrams", "fatGrams"]
                        }
                    },
                    required: ["day", "meals", "dailyTotals"]
                }
            },
            nutritionalJustificationTable: {
                type: Type.ARRAY,
                description: "Table justifying how the plan meets targets.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        parameter: { type: Type.STRING },
                        target: { type: Type.STRING },
                        planAchieves: { type: Type.STRING },
                        justification: { type: Type.STRING }
                    },
                    required: ["parameter", "target", "planAchieves", "justification"]
                }
            },
            conditionSpecificAdjustments: {
                type: Type.ARRAY,
                description: "Adjustments made for specific health conditions.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        condition: { type: Type.STRING },
                        adjustment: { type: Type.STRING },
                        conflictFlag: { type: Type.BOOLEAN, description: "True if there is a potential conflict or warning." }
                    },
                    required: ["condition", "adjustment", "conflictFlag"]
                }
            }
        },
        required: ["planSummary", "dailyPlans", "nutritionalJustificationTable", "conditionSpecificAdjustments"]
    };
};

const mealSwapSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            swapName: { type: Type.STRING, description: "The name of the suggested swap ingredient." },
            recalculatedMeal: mealItemSchema
        },
        required: ["swapName", "recalculatedMeal"]
    }
};

const generateUserProfileText = (profile: UserProfile): string => `
    Here is the user's comprehensive health profile:
    - Name: ${profile.name}
    - Age: ${profile.dob ? new Date().getFullYear() - new Date(profile.dob).getFullYear() : 'Not provided'}
    - Gender: ${profile.gender || 'Not provided'}
    - Location: ${profile.location?.city || ''}, ${profile.location?.state || 'Not provided'}
    - Language: ${profile.language || 'English'}
    
    - Health Goals: ${profile.healthGoals.join(', ') || 'None'}
    - Health Conditions: ${profile.healthConditions.join(', ') || 'None'}
    - Other Conditions: ${profile.otherConditions?.join(', ') || 'None'}
    - Current Medications: ${profile.medications.join(', ') || 'None'}
    - Dietary Preferences/Restrictions: ${profile.dietaryPreferences.join(', ') || 'None'}
    - Known Allergies: ${profile.allergies.join(', ') || 'None'}
    
    - General Lifestyle:
        - Activity Level: ${profile.activityLevel || 'N/A'}
        - Stress: ${profile.stressLevel || 'N/A'}
        - Smoking: ${profile.smoking ?? 'N/A'}
        - Alcohol: ${profile.alcohol || 'N/A'}
        - Sleep: ~${profile.sleepHours} hours (Quality: ${profile.sleepQuality || 'N/A'}, Source: ${profile.sleepTracking || 'Estimate'})

    - Eating Habits & Patterns:
        - Meal Frequency: ${profile.mealFrequency || 'N/A'}
        - Meal Timing: ${profile.mealTiming || 'N/A'}
        - Largest Meal: ${profile.mainMeal || 'N/A'}
        - Cooking Skill: ${profile.cookingSkills || 'N/A'}
        - Time per Meal: ${profile.cookingTime || 'N/A'}

    - Mind & Body Context:
        - Hydration: ~${profile.waterIntakeLiters || 'N/A'} L/day. Primary beverages: ${profile.primaryBeverages?.join(', ') || 'N/A'}
        - Social Eating: ${profile.socialEatingFrequency || 'N/A'}
        - Emotional Eating: ${profile.emotionalEating || 'N/A'}
        - Motivation Level: ${profile.motivation || 'N/A'}
        - Social Support: ${profile.socialSupport ?? 'N/A'}
        - Mindful Eating: ${profile.mindfulEating ?? 'N/A'}
        - Current Life Stage: ${profile.lifeStage || 'N/A'}
        - Recent Life Events: ${profile.lifeEvents?.join(', ') || 'None'}
`;


export const analyzeLabelImage = async (
    base64Image: string,
    mimeType: string,
    profile: UserProfile
): Promise<{ nutritionData: NutritionData; gptAnalysis: GPTAnalysis }> => {
    
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };

    const userProfileText = generateUserProfileText(profile);

    const prompt = `
        Analyze the provided food nutrition label image. Based *only* on the information in the image and the user's health profile, perform the following tasks:

        1.  **Extract Data**: Meticulously extract all information from the nutrition facts table, ingredients list, and allergen warnings.
        2.  **Analyze & Personalize**: Evaluate the extracted data in the context of the user's comprehensive health profile.
        3.  **Generate Personalized Score**: Create a single 'personalizedScore' from 1-10. The score must reflect how well this food aligns with the user's most critical health conditions and goals. Provide a concise 'rationale'.
        4.  **Provide Quantitative Guidance**: Generate 'portioningGuidance'. If the user has diabetes, use a standard 45g carbohydrate per meal guideline to calculate and explain a reasonable portion size in real-world terms (e.g., "2-3 cakes").
        5.  **Flag Key Ingredients**: Analyze the ingredients list and populate 'flaggedIngredients'. Identify ingredients that are particularly good or bad for the user and provide a short 'reason'.
        6.  **Provide Actionable Insights (When Relevant)**:
            - **Glycemic Impact**: Assess the product's likely effect on blood sugar.
            - **Contextual Notes**: Provide crucial context (e.g., missing Potassium/Phosphorus info for a CKD user).
            - **Meal Pairings, Time of Day, Smarter Swaps**: Offer specific, actionable suggestions.
        7.  **Check for Recalls**: Simulate a search of public recall databases (like the FDA). If a relevant recall is found, you MUST provide a valid, clickable URL to the official source. If not, set 'isRecalled' to false. **Do not invent recalls or sources.**
        8.  **Format Output**: Return the analysis in a single, clean JSON object matching the provided schema. Do not include any markdown formatting like \`\`\`json.
        9.  **Translate**: The entire JSON response MUST be fully and accurately translated into the user's specified language: **${profile.language}**.

        ${userProfileText}

        Your analysis must be objective, informative, and deeply personalized. Prioritize accuracy and verifiability. Fill all fields in the schema if the information is relevant.
    `;

    try {
        // FIX: Use ai.models.generateContent instead of a deprecated API.
        const response = await ai.models.generateContent({
            // FIX: Use the correct model name 'gemini-2.5-flash'.
            model: "gemini-2.5-flash",
            contents: [{ parts: [imagePart, { text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        // FIX: Directly access response.text to get the generated text.
        const jsonText = response.text;
        const result = JSON.parse(jsonText);
        
        if (!result.nutritionData || !result.gptAnalysis) {
            throw new Error("Invalid response structure from API.");
        }

        return result;

    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        throw new Error("Failed to analyze the food label. The AI model could not process the request. Please try again with a clearer image.");
    }
};

export const analyzePlateImage = async (
    base64Image: string,
    mimeType: string,
    profile: UserProfile
): Promise<PlateAnalysis> => {

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };

    const userProfileText = generateUserProfileText(profile);
    
    const prompt = `
        You are an expert AI nutritionist with advanced image recognition capabilities and deep expertise in diverse Indian cuisines. Your task is to analyze an image of a meal and provide a detailed, personalized nutritional breakdown based on the user's health profile.

        **CRITICAL INSTRUCTIONS FOR ACCURATE COUNTING:**
        You must be extremely precise when counting small, clustered items like nuts, seeds, and dried fruits. Follow this multi-stage process internally before generating the JSON:
        1.  **Overall Object Detection:** First, identify the larger food items (e.g., 'Vermicelli Upma', 'Red Banana').
        2.  **Small Item Segmentation:** For groups of small items (e.g., a pile of nuts, a cluster of dried figs), carefully analyze the image to segment each individual piece. Look for subtle edges, shadows, and variations in shape and texture that separate one item from another. Do NOT count wrinkles on a single dried fruit as multiple items. For example, in a pile of almonds, identify the boundary of each almond.
        3.  **Precise Counting Algorithm:** Count each segmented piece meticulously. For example, if you see four distinct almond shapes, your quantity must be '4 almonds', not a generic "handful". If you see one dried fig, count it as one, even if it has wrinkles. Be specific (e.g., '5 walnut halves').
        4.  **Confidence Validation:** Your \`confidenceScore\` for each item must reflect the difficulty of this process. A single, clear banana should have a high confidence (e.g., 0.95-1.0). A tight cluster of nuts where counting is difficult should have a slightly lower confidence (e.g., 0.85-0.90) to reflect the estimation challenge.

        **YOUR TASK:**
        1.  **Expert Indian Cuisine Analysis**: As an expert in diverse Indian cuisines, from North to South, recognize complex dishes (e.g., biryanis, curries, thalis) and their typical ingredients. Provide culturally relevant feedback.
        2.  **Identify & Quantify**: Meticulously identify every food item on the plate. Estimate the portion size of each item in grams or common household measures (e.g., '1 cup cooked rice'). For small items, provide a precise count as instructed above.
        3.  **Nutritional Estimation**: For each identified item, provide an accurate estimation of its nutritional content, including calories, protein, carbohydrates, and fat.
        4.  **Aggregate Totals**: Calculate the total calories, protein, carbohydrates, and fat for the entire meal.
        5.  **Generate Meal Score**: Based on the user's health profile and the meal's components, calculate a \`mealScore\` from 1 to 10. A score of 8-10 is 'green' (very healthy), 4-7 is 'yellow' (moderately healthy), and 1-3 is 'red' (unhealthy). Provide a concise \`scoreRationale\` explaining the main reasons for the score. Assign the corresponding \`scoreColor\`.
        6.  **Categorize Meal**: Determine if the meal is likely \`Breakfast\`, \`Lunch\`, \`Dinner\`, or a \`Snack\`.
        7.  **Personalized Analysis**: Using the provided user health profile, generate a comprehensive analysis. This must include:
            *   **Summary**: A concise paragraph evaluating the meal's suitability for the user.
            *   **Positive/Negative Points**: Bullet points highlighting the good and bad aspects of the meal in relation to the user's goals and conditions.
            *   **Portioning Guidance**: Actionable advice on whether the portion size is appropriate.
            *   **Healthier Swaps**: Suggestions for healthier alternatives.
            *   **Dietary Compliance**: Assess how the meal aligns with the user's specified dietary preferences (e.g., Vegetarian, Low Sodium).
        8.  **Formatting**: Return the entire analysis as a single, clean JSON object matching the provided schema. Do not include any markdown formatting like \`\`\`json.
        9.  **Translate**: The entire JSON response MUST be fully and accurately translated into the user's specified language: **${profile.language}**.

        ${userProfileText}

        Your analysis must be thorough, data-driven, and deeply personalized. Prioritize accuracy and practical advice, especially in counting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [imagePart, { text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: plateAnalysisSchema,
            },
        });
        
        const jsonText = response.text;
        const result = JSON.parse(jsonText);
        
        if (!result.foodItems || !result.personalizedFeedback) {
            throw new Error("Invalid response structure from API for plate analysis.");
        }

        return result;

    } catch (error) {
        console.error("Error analyzing plate image with Gemini:", error);
        throw new Error("Failed to analyze the meal. The AI model could not process the request. Please try again with a clearer image.");
    }
};


export const extractProfileFromFile = async (
    base64File: string,
    mimeType: string,
): Promise<Partial<UserProfile>> => {
    
    const filePart = {
        inlineData: {
            data: base64File,
            mimeType,
        },
    };

    const prompt = `
        Analyze the provided document (which could be an image, PDF, or Word document) containing a user's health or personal information. Your task is to act as a data extraction tool.

        1.  **Identify Key Information**: Meticulously scan the document to identify the following data points:
            -   Full Name
            -   Date of Birth (format it as YYYY-MM-DD)
            -   Gender
            -   Location (State and City/District)
            -   Medical Conditions (e.g., Diabetes, Hypertension)
            -   Allergies
            -   Intolerances
            -   Current Medications

        2.  **Extract Accurately**: Extract the information exactly as found. Do not infer or add information that is not present. If a field is not found, omit it from the JSON response.

        3.  **Format Output**: Return the extracted data in a single, clean JSON object matching the provided schema. Do not include any markdown formatting like \`\`\`json. Only include fields for which you found data.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [filePart, { text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: profileExtractionSchema,
            },
        });
        
        const jsonText = response.text;
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error extracting profile from file with Gemini:", error);
        throw new Error("Failed to analyze the document. The AI model could not process the file. Please try again with a clearer document.");
    }
};

export const extractLabValuesFromFile = async (
    base64File: string,
    mimeType: string,
): Promise<string> => {
    
    const filePart = {
        inlineData: {
            data: base64File,
            mimeType,
        },
    };

    const prompt = `
        Analyze the provided document, which is a medical lab report (image, PDF, or DOCX).
        Your sole task is to act as an Optical Character Recognition (OCR) and data extraction tool.

        1.  **Identify Biomarkers**: Scan for common blood test results. Focus on values like HbA1c, Cholesterol (Total, LDL, HDL), Triglycerides, TSH, Glucose, Uric Acid, Creatinine, etc.
        2.  **Extract Data**: Extract the biomarker name, its value, and its units exactly as found.
        3.  **Format Output**: Return ALL extracted key-value pairs as a SINGLE, comma-separated string.
            - **Correct Format**: "HbA1c: 6.5%, Total Cholesterol: 180 mg/dL, TSH: 2.5 mIU/L"
            - **CRITICAL**: Do NOT add any introductory text, explanations, summaries, or markdown formatting like \`\`\`. The output must ONLY be the comma-separated string of results. If no results are found, return an empty string.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [filePart, { text: prompt }] }],
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error extracting lab values from file with Gemini:", error);
        throw new Error("OCR/Parsing Failed: Could not extract valid biomarker data from the document.");
    }
};


export const getShoppingSuggestions = async (
    itemName: string,
    userProfile: UserProfile
): Promise<{ category: string; seasonalAlternatives: { alternative: string; reason: string }[] }> => {
    
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

    const prompt = `
        As a smart shopping assistant, analyze the grocery item "${itemName}". 
        The user is located in ${userProfile.location.city}, ${userProfile.location.state}, India, and the current month is ${currentMonth}.
        The user's health goals are: ${userProfile.healthGoals.join(', ')}.

        Your tasks are:
        1.  Categorize this item into one of the standard grocery store aisles.
        2.  Suggest 2-3 healthier, seasonal, or more cost-effective alternatives available in the user's region.
        3.  For each alternative, provide a concise one-sentence reason that connects to the user's health goals or the benefits of seasonality.

        Return the response in a clean JSON object matching the provided schema. Do not include any markdown formatting like \`\`\`json.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }],
            config: {
                responseMimeType: "application/json",
                responseSchema: shoppingSuggestionsSchema,
            },
        });

        const jsonText = response.text;
        const result = JSON.parse(jsonText);

        if (!result.category || !result.seasonalAlternatives) {
            throw new Error("Invalid response structure from shopping suggestions API.");
        }

        return result;

    } catch (error) {
        console.error("Error getting shopping suggestions from Gemini:", error);
        // Fallback in case of an error
        return {
            category: "Pantry",
            seasonalAlternatives: [],
        };
    }
};

const calculateTDEE = (profile: UserProfile): number | null => {
    const { dob, gender, currentWeightKg, heightCm, activityLevel } = profile;
    if (!dob || !gender || !currentWeightKg || !heightCm || !activityLevel) {
        return null;
    }

    const age = new Date().getFullYear() - new Date(dob).getFullYear();

    let bmr: number;
    // Mifflin-St Jeor Equation
    if (gender === 'Male') {
        bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age + 5;
    } else { // Female or Other
        bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age - 161;
    }

    const activityFactors: { [key: string]: number } = {
        'Sedentary': 1.2,
        'Light': 1.375,
        'Moderate': 1.55,
        'Active': 1.725,
        'Athlete': 1.9,
        '': 1.375 // Default to Light if not specified
    };
    
    const activityFactor = activityFactors[activityLevel];
    return bmr * activityFactor;
}

export const generateMealPlan = async (
    profile: UserProfile,
    goal: {
        type: 'lose' | 'maintain' | 'gain';
    }
): Promise<MealPlan> => {

    // Server-side validation for critical biometric data
    if (profile.neckCircumferenceCm && (profile.neckCircumferenceCm < 30 || profile.neckCircumferenceCm > 60)) {
        throw new Error("Validation Error: Neck circumference must be between 30 and 60 cm.");
    }
    if (profile.waistCircumferenceCm && (profile.waistCircumferenceCm < 60 || profile.waistCircumferenceCm > 160)) {
        throw new Error("Validation Error: Waist circumference must be between 60 and 160 cm.");
    }
    if (profile.hipCircumferenceCm && (profile.hipCircumferenceCm < 60 || profile.hipCircumferenceCm > 180)) {
        throw new Error("Validation Error: Hip circumference must be between 60 and 180 cm.");
    }

    const tdee = calculateTDEE(profile);
    let targetCalories: number;

    if (tdee) {
        switch(goal.type) {
            case 'lose':
                targetCalories = tdee - 500;
                break;
            case 'gain':
                targetCalories = tdee + 500;
                break;
            case 'maintain':
            default:
                targetCalories = tdee;
                break;
        }
    } else {
        // Fallback calories if TDEE can't be calculated
        targetCalories = goal.type === 'lose' ? 1800 : goal.type === 'gain' ? 2500 : 2200;
    }

    // Calculate Waist-to-Hip Ratio (WHR) if possible - for all genders
    let whr: number | null = null;
    if (profile.waistCircumferenceCm && profile.hipCircumferenceCm && profile.hipCircumferenceCm > 0) {
        whr = profile.waistCircumferenceCm / profile.hipCircumferenceCm;
    }

    const mealPlanSchema = generateDynamicMealPlanSchema(profile);
    const mealLabels = getMealLabelsForFrequency(profile.preferredMealFrequency);

    const systemInstruction = `You are an Evidence-Based Clinical Dietitian AI. Your task is to generate a comprehensive, personalized, 7-day rotating meal plan. You must adhere strictly to the user's profile, health conditions, and cultural constraints. All nutritional calculations must be performed accurately. Your primary constraint is safety and clinical accuracy. The entire response must be in the user's specified language: ${profile.language}.`;

    const prompt = `
        Based on the user's comprehensive profile and their stated goals, create a detailed 7-day meal plan.

        **USER PROFILE & GOALS:**
        - **Basic Info**: Age ${profile.dob ? new Date().getFullYear() - new Date(profile.dob).getFullYear() : 'N/A'}, Gender: ${profile.gender}
        - **Primary Goal**: ${goal.type} weight
        - **Target Daily Calories**: Approximately ${Math.round(targetCalories)} kcal
        - **Health Conditions**: ${profile.healthConditions?.join(', ') || 'None'}
        - **Allergies**: ${profile.allergies?.join(', ') || 'None'}
        - **Dietary Preferences**: ${profile.dietaryPreferences?.join(', ') || 'None'}

        **Anthropometrics & Risk Factors:**
        - **Height**: ${profile.heightCm} cm
        - **Current Weight**: ${profile.currentWeightKg} kg
        - **Target Weight**: ${profile.targetWeightKg} kg
        - **Neck Circumference**: ${profile.neckCircumferenceCm || 'N/A'} cm
        - **Waist Circumference**: ${profile.waistCircumferenceCm || 'N/A'} cm
        - **Hip Circumference**: ${profile.hipCircumferenceCm || 'N/A'} cm
        - **Waist-to-Hip Ratio (WHR)**: ${whr ? whr.toFixed(2) : 'N/A'}

        **Lifestyle & Preferences:**
        - **Cuisine Preference**: ${profile.culturalCuisinePref || 'Any'}
        - **Meal Frequency**: ${profile.preferredMealFrequency || 4} meals/day. You MUST structure the plan with these exact meal labels: ${mealLabels.join(', ')}.
        - **Cooking Time Preference**: ${profile.cookingTime || 'Any'}
        - **Disliked Foods**: ${profile.dislikedFoods?.join(', ') || 'None'}
        - **Current Supplements**: ${profile.currentSupplements?.join(', ') || 'None'}

        **Metabolic Health (Optional Data):**
        - **Lab Values Provided**: ${profile.labValues || 'None provided'}

        **INSTRUCTIONS & CONSTRAINTS (PRO MAX LEVEL):**
        1.  **Clinical Accuracy & Safety**: Your top priority.
            - **Glycemic Load (GL)**: For each meal, you MUST calculate the Glycemic Load (GL) and include it in \`glycemicInfo.load\`. This is critical.
            - **Food Conflict Alerts**: Examine the user's \`labValues\`. If it indicates high uric acid, and you include a moderate-to-high purine ingredient (e.g., rajma/kidney beans, lentils), you MUST add a note to that ingredient with type 'alert' and a brief explanation (e.g., 'Kidney beans are moderate in purine. This portion is balanced within the plan.').
            - **Supplement Interactions**: Review \`currentSupplements\`. If a supplement might interact with a meal (e.g., high-dose Vitamin D with a calcium-rich meal), add a note of type 'interaction' to the relevant ingredient.
            - **Calorie Allocation**: Intelligently allocate calories across the meals. For plans with 5 or 6 meals, ensure the snacks ('Early Morning', 'Mid-Morning Snack', 'Evening Snack') are smaller in portion/calories than the main meals ('Breakfast', 'Lunch', 'Dinner').
            - **Supplement Awareness**: Analyze the user's \`currentSupplements\` and \`medications\` list for vitamins or minerals (e.g., Vitamin D, Zinc, Iron). Ensure the meal plan includes natural sources of these nutrients and mention this in your justification. This helps reduce reliance on supplements where possible.
        2.  **Generate a 7-Day Plan**: Create a full 7-day plan (Monday-Sunday) with 7 unique days.
        3.  **Adhere to Constraints**: The plan MUST strictly adhere to all user preferences: cuisine, meal frequency, disliked foods, cooking time, allergies, and dietary needs.
        4.  **Meal Details**: Each meal must have a maximum of 5 main ingredients. Provide pre-cooked weights in grams. Include simple recipes.
        5.  **Localized Sourcing**: If cuisine is specific (e.g., 'Tamil') and an ingredient is unique, add a practical sourcing tip as a note with type 'info' (e.g., "Roasted chana dal - check local 'Nalla Kadai' stores").
        6.  **Justification**: You MUST include the 'nutritionalJustificationTable' and 'conditionSpecificAdjustments' sections, accurately reflecting how the plan addresses the user's profile. Set 'conflictFlag' to true for any potential issues.
        7.  **Format Output**: Return the entire plan as a single, clean JSON object matching the provided schema. Do not include any markdown formatting.
        8.  **Translate**: The entire JSON response MUST be fully and accurately translated into the user's specified language: **${profile.language}**.
    `;

     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }],
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: mealPlanSchema,
            },
        });
        
        const jsonText = response.text;
        const result = JSON.parse(jsonText);
        
        if (!result.dailyPlans || result.dailyPlans.length < 7) {
            throw new Error("Invalid meal plan structure from API.");
        }

        const fullPlan: MealPlan = {
            id: new Date().toISOString(),
            startDate: new Date().toISOString().split('T')[0],
            ...result
        };

        return fullPlan;

    } catch (error) {
        console.error("Error generating meal plan with Gemini:", error);
        throw new Error("Failed to generate the meal plan. The AI model could not process the request. Please try again.");
    }
};


export const getIngredientSwaps = async (
    originalMeal: MealItem,
    ingredientToSwap: MealIngredient,
    profile: UserProfile
): Promise<MealSwapSuggestion[]> => {
    const systemInstruction = `You are an expert Dietitian AI. Your task is to provide ingredient swap suggestions and recalculate meal nutrition instantly. Respond ONLY with the requested JSON. The entire response must be in the user's specified language: ${profile.language}.`;

    const prompt = `
        The user wants to swap an ingredient in their meal.
        - **Original Meal**: ${JSON.stringify(originalMeal)}
        - **Ingredient to Swap**: ${ingredientToSwap.name}
        - **User Profile**: A ${profile.dob ? new Date().getFullYear() - new Date(profile.dob).getFullYear() : 'N/A'} year old ${profile.gender} with health goals: ${profile.healthGoals.join(', ')}.

        **Your tasks are:**
        1.  Suggest 2 healthy and contextually appropriate alternatives for "${ingredientToSwap.name}".
        2.  For EACH alternative, fully recalculate the entire meal's nutritional data (macros, calories) and its Glycemic Load (GL).
        3.  Maintain the structure of the original meal, only changing the swapped ingredient, its weight (if necessary for a logical portion), and the calculated values.
        4.  Re-evaluate any ingredient notes based on the new composition.
        5.  Return the result as a JSON array matching the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }],
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: mealSwapSchema,
            },
        });

        const jsonText = response.text;
        const result = JSON.parse(jsonText);
        
        if (!Array.isArray(result)) {
            throw new Error("Invalid response structure for ingredient swap.");
        }

        return result;

    } catch (error) {
        console.error("Error getting ingredient swaps from Gemini:", error);
        throw new Error("Failed to get ingredient swaps. The AI model could not process the request.");
    }
};