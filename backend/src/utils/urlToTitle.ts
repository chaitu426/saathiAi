import { URL } from "url";

export function generateTitleFromLink(link: string): string {
  try {
    const urlObj = new URL(link);
    let lastSegment = urlObj.pathname.split("/").filter(Boolean).pop() || urlObj.hostname;
    lastSegment = lastSegment.replace(/[-_]/g, " ");
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  } catch {
    return "Untitled";
  }
}
