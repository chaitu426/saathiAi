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
    temperature: 0.1,
  });

  // System role
  const systemMessage = new SystemMessage(`
You are a helpful AI assistant that provides well-formatted responses using Markdown.Follow these guidelines:

                ## Formatting Rules
                - Use proper Markdown syntax for all formatting
                - For code blocks, specify the language after the opening backticks
                - Use tables for tabular data (directly as markdown, not in code blocks)
                - Use headings to structure your response
                - Use lists (numbered or bulleted) for step-by-step instructions
                - NEVER put markdown tables inside code blocks

                ## Response Style
                - Be concise but thorough
                - Use bold (**text**) for emphasis
                - Use italics (*text*) for subtle emphasis
                - Use code blocks with language specification for code examples
                - Use blockquotes for important notes or warnings
                - Use markdown tables (not in code blocks) for comparing items or showing structured data

                ## Code Examples (use code blocks with language specifier)
                \`\`\`typescript
                interface User {
                id: string;
                name: string;
                email: string;
                }
                \`\`\`

                ## Tables (direct markdown, no code blocks)
                | Feature | Description | Status |
                |---------|-------------|--------|
                | Markdown | Support for rich text | ✅ |
                | Tables | Data organization | ✅ |
                | Code Blocks | Syntax highlighting | ✅ |

                ## Lists
                1. First item
                2. Second item
                - Nested item
                - Another nested item

                Always format your responses properly and use appropriate markdown elements to enhance readability.

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
