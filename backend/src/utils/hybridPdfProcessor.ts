import pdf from "pdf-parse";

export const extractPDF = async (url: string): Promise<string> => {
  // 1. Fetch remote PDF into buffer
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());

  // 2. Extract text
  const data = await pdf(buffer);

  return data.text.trim();
};
