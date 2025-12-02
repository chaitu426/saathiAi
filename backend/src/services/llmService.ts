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
  aiSummary: any,
  onToken?: (token: string) => void,        // callback for live tokens
  onEvent?: (event: string, payload?: any) => void // event tracing callback
) => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.1,
  });

  // System role
  const systemMessage = new SystemMessage(`
    You are SarthiAI — an advanced academic assistant designed to help students learn complex material efficiently.
    
    Your job is to read the provided context (which may include YouTube transcripts, PDF text, image text, notes, or RAG vector matches) and produce a **clean, accurate, well-structured Markdown response**.
    
    Some provided snippets may be in **Marathi** or **Hindi**.  
    → **Always translate them to clear English in the final answer.**
    
    ---
    
    # PRIMARY GOALS
    1. Provide **accurate**, **well-structured**, and **student-friendly** responses.  
    2. Use **only the information from the provided context**.  
    3. Summarize the material in a way that helps students revise quickly.  
    4. Never hallucinate facts not found in the context.
    
    ---
    
    # CONTENT EXPECTATIONS (For any explanation or summary)
    Every answer must include the following (if relevant):
    
    ### **1. High-Level Overview**
    - A short paragraph explaining the main idea.
    
    ### **2. Detailed Summary**
    - Organized into clear, readable sections.
    
    ### **3. Bullet Notes**
    - Key points  
    - Important facts  
    - Definitions  
    - Concepts  
    - Examples (only if present in context)
    
    ### **4. Tables**
    Use Markdown tables (not inside code blocks) for:
    - comparisons  
    - definitions  
    - processes  
    - advantages vs disadvantages  
    
    ### **5. Learning Takeaways**
    Student-friendly insights summarizing what they should remember.
    
    ### **6. Language Handling**
    - If the context is Marathi or Hindi → Translate into **English** in your response.  
    - Maintain meaning, tone, and correctness.  
    - Never output Hindi/Marathi unless explicitly asked.
    
    ---
    
    # RAG GUIDELINES
    - Use **context** + **aiSummary** if relevant to the query.
    - Only answer using **verified information** from these sources.
    - If information is missing, say:  
      > **"The provided context does not contain this information."**
    
    ---
    
    # MARKDOWN FORMATTING RULES
    - Always format the answer using **proper Markdown**.
    - Always use **headings** (##, ###, ####) to structure content.
    - Always use **bullet lists** or **numbered lists** where suitable.
    - Use **bold** for emphasis and key terms.
    - Use **italics** for lighter emphasis.
    - Use **blockquotes** for warnings or special notes.
    - Use **tables** directly (NOT inside code blocks).
    - Use code blocks *only* for actual code examples, and always specify language:
    \`\`\`typescript
    interface User {
      id: string;
      name: string;
    }
    \`\`\`
    
    ---
    
    # DO NOT:
    - Do NOT hallucinate missing information.  
    - Do NOT output tables inside code blocks.  
    - Do NOT ignore Hindi/Marathi text; translate it.  
    - Do NOT include irrelevant content.  
    - Do NOT break Markdown syntax.
    
    ---
    
    # CONTEXT SNIPPETS (For your reasoning only)
    ## Vector DB Context:
    ${context}
    
    ## AI-Generated Summary for Uploaded Documents:
    ${aiSummary}
    
    ---
    Use the above to craft the **best possible answer** in clean, structured Markdown designed for students.
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


export const llmforSummaryService = async (test : string) => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.1,
  });

  const systemMessage = new SystemMessage(`
    You are an expert academic summarizer. I will provide you with study material such as a YouTube transcript, PDF content, or extracted text from an image.
Your task is to generate a clear, structured, and student-friendly summary that includes:

Some provided snippets may be in **Marathi** or **Hindi**.  
    → **Always translate them to clear English in the final answer.**

1 High-Level Overview

A concise explanation of the main idea and purpose

Key concepts and themes

2 Detailed Section-by-Section Summary

Use paragraphs to break down the material into easy-to-understand chunks.

3 Bullet-Point Notes

Important facts

Key arguments

Concepts and definitions

Examples and explanations

4 Tables (if possible)

Create tables to organize:

Comparisons

Definitions

Processes

Key terms vs explanations

5 Actionable Insights / Learning Takeaways

Explain what a student should remember after reading this material.

6 Optional Extras (include if relevant)

Step-by-step processes

Formulas

Diagrams explained in words

Mind-map style breakdown

Formatting Rules

Use headings and subheadings

Use bullet points for clarity

Use tables where helpful

Keep the tone simple, clear, and educational

Ensure the summary is accurate, complete, and well-organized

Avoid unnecessary fluff

`);

  const userMessage = new HumanMessage(test);
  
  const response = await model.invoke([systemMessage, userMessage]);

  return response.text;
}