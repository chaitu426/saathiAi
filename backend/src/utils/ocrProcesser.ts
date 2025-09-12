// utils/ocrProcessor.ts
import Tesseract from "tesseract.js";

export const runOCR = async (url: string): Promise<string> => {
  const result = await Tesseract.recognize(url, "eng", {
    logger: (m) => console.log(m), // optional
  });
  return result.data.text;
};
