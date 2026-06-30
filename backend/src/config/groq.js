/**
 * Groq API Configuration
 * Uses the OpenAI-compatible chat completions endpoint.
 * Docs: https://console.groq.com/docs/quickstart
 */

const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; // Large context, fast, and high reasoning capability

/**
 * Send a prompt to Groq and return the text response.
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string|null>} - The text response or null on error
 */
export const askGroq = async (prompt) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not defined in env variables.");
    }

    const response = await fetch(GROQ_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Groq API ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error(`[Groq API Error]: ${error.message}`);
    return null;
  }
};

/**
 * Send a prompt to Groq and parse the response as JSON.
 * Strips markdown code fences if present before parsing.
 * @param {string} prompt - The prompt to send
 * @returns {Promise<object|null>} - The parsed JSON object or null on error
 */
export const askGroqJSON = async (prompt) => {
  try {
    const text = await askGroq(prompt);
    if (!text) return null;

    // Strip markdown code fences (```json ... ``` or ``` ... ```)
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(`[Groq API JSON Error]: ${error.message}`);
    return null;
  }
};
