import { google } from "@ai-sdk/google";

// Main model for the application
export const model = google("gemini-2.0-flash-001");

// Available model alternatives for testing
export const models = {
  // Latest flash model (recommended)
  "gemini-2.0-flash-001": google("gemini-2.0-flash-001"),

  // Experimental models (if available)
  "gemini-2.0-flash-exp": google("gemini-2.0-flash-exp"),

  // Previous generation models
  "gemini-1.5-flash": google("gemini-1.5-flash"),
  "gemini-1.5-flash-002": google("gemini-1.5-flash-002"),

  // Pro models (higher quality, slower)
  "gemini-1.5-pro": google("gemini-1.5-pro"),
  "gemini-1.5-pro-002": google("gemini-1.5-pro-002"),
} as const;

export type ModelName = keyof typeof models;
