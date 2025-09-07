import { GoogleGenAI, Type } from "@google/genai";
import type { CodeReviewFeedback } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overall_assessment: {
            type: Type.STRING,
            description: "A brief, high-level summary of the code quality."
        },
        potential_bugs: {
            type: Type.ARRAY,
            description: "A list of potential bugs or logical errors in the code.",
            items: {
                type: Type.OBJECT,
                properties: {
                    line: {
                        type: Type.INTEGER,
                        description: "The line number where the issue is found. Use -1 if not applicable to a specific line."
                    },
                    comment: {
                        type: Type.STRING,
                        description: "A detailed explanation of the potential bug."
                    }
                },
                required: ["line", "comment"]
            }
        },
        style_suggestions: {
            type: Type.ARRAY,
            description: "Suggestions for improving code style, formatting, and readability.",
            items: {
                type: Type.OBJECT,
                properties: {
                    line: {
                        type: Type.INTEGER,
                        description: "The line number where the style issue is. Use -1 if not applicable."
                    },
                    comment: {
                        type: Type.STRING,
                        description: "A detailed explanation of the style suggestion."
                    }
                },
                required: ["line", "comment"]
            }
        },
        best_practices: {
            type: Type.ARRAY,
            description: "Recommendations for adhering to language-specific best practices and improving performance or security.",
            items: {
                type: Type.OBJECT,
                properties: {
                    line: {
                        type: Type.INTEGER,
                        description: "The relevant line number. Use -1 if not applicable."
                    },
                    comment: {
                        type: Type.STRING,
                        description: "A detailed explanation of the best practice recommendation."
                    }
                },
                required: ["line", "comment"]
            }
        }
    },
    required: ["overall_assessment", "potential_bugs", "style_suggestions", "best_practices"]
};


export const reviewCode = async (code: string, language: string): Promise<CodeReviewFeedback> => {
  const prompt = `
    As an expert code reviewer, analyze the following ${language} code.
    Identify potential bugs, suggest style improvements, and recommend best practices.
    Provide your feedback in a structured JSON format according to the provided schema.
    For each item, specify the line number if applicable, otherwise use -1.

    Code to review:
    \`\`\`${language}
    ${code}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    
    // The response is expected to be a valid JSON string matching the schema.
    const parsedResponse = JSON.parse(jsonText);

    return parsedResponse as CodeReviewFeedback;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = String(error).toLowerCase();

    if (errorMessage.includes('safety')) {
      throw new Error("The code could not be reviewed due to safety restrictions. Please check your code for any policy violations.");
    }

    if (errorMessage.includes('api key') || errorMessage.includes('permission denied')) {
      throw new Error("Invalid API Key. Please ensure it is configured correctly in your environment.");
    }

    if (errorMessage.includes('rate limit')) {
      throw new Error("You have exceeded the API request rate limit. Please wait and try again later.");
    }
    
    // A more generic but still informative error for other cases
    throw new Error("Failed to get code review. The AI model may be temporarily unavailable or encountered an error processing the request.");
  }
};