import { generateText } from "ai";
import { model } from "./models";

// Simple test function to verify the model works
export async function testModel() {
  try {
    const result = await generateText({
      model,
      prompt: "Hello! Can you confirm you're working correctly? Please respond with 'Model is working correctly' and tell me which model you are.",
    });

    console.log("✅ Model test successful:");
    console.log(result.text);
    return true;
  } catch (error) {
    console.error("❌ Model test failed:", error);
    return false;
  }
}

// Test function that can be called from API routes
export async function testModelWithTools() {
  try {
    const result = await generateText({
      model,
      prompt: "Do you support tool calling? Please respond with 'Yes' or 'No' and explain.",
      tools: {
        testTool: {
          description: "A test tool to verify tool calling works",
          parameters: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "A test message"
              }
            },
            required: ["message"]
          },
          execute: async ({ message }) => {
            return `Tool called with message: ${message}`;
          }
        }
      }
    });

    console.log("✅ Tool calling test successful:");
    console.log(result.text);
    return true;
  } catch (error) {
    console.error("❌ Tool calling test failed:", error);
    return false;
  }
}
