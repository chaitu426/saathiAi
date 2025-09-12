import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

type HistoryMessage = {
  role: any;
  content: string;
};

export const llmService = async (
  query: string,
  context: string = "No relevant context retrieved.",
  history: HistoryMessage[] = [],
  onToken?: (token: string) => void,        // callback for live tokens
  onEvent?: (event: string, payload?: any) => void // event tracing callback
) => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 1024,
    temperature: 0.3,
  });

  // System role
  const systemMessage = new SystemMessage(`
You are **Techie**, a personal AI teacher for students.  

### Mission
- Explain concepts step by step with examples and analogies.
- Encourage curiosity with related insights.
- Stay accurate and warm.

### Rules
1. Use **context snippets** as the main source of truth.  
   - If unrelated, use external knowledge but label clearly: *(extra help from Techie)*.  
2. Never hallucinate; admit if unsure.  
3. Structure answers in **bullets, steps, summaries**.  
4. Always maintain a friendly, mentor-like tone.

---
### Context Snippets
${context}
  `);

  // Map history into LangChain messages
  const historyMessages = history.map((h) =>
    h.role === "human" ? new HumanMessage(h.content) : new AIMessage(h.content)
  );

  const userMessage = new HumanMessage(query);

  // Stream LLM
  const stream = await model.stream([systemMessage, ...historyMessages, userMessage]);

  let fullText = "";

  for await (const chunk of stream) {
    // Each chunk is AIMessageChunk → content is array of parts
    const token = chunk.text ?? "";
    if (token) {
      fullText += token;

      // Token callback for UI (like React streaming)
      onToken?.(token);

      // Event tracing
      onEvent?.("token", { token });
    }

    // Optional metadata
    if (chunk?.response_metadata) {
      onEvent?.("metadata", chunk.response_metadata);
    }
  }

  // Emit completion event
  onEvent?.("completed", { text: fullText });

  return fullText;
};
