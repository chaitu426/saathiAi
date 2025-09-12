import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

export const webpageExtractor = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: { headless: true },
        gotoOptions: { waitUntil: "networkidle2" },
        
    });
    
    const docs = await loader.load();
    return docs[0]?.pageContent;
}