import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

export const ytextractor = async (url: string) => {
    const loader = YoutubeLoader.createFromUrl(url, {
        language: "en",
        addVideoInfo: true,
    });

    const docs = await loader.load();

    //make metadata and pageContent in one string
    const final = `Title: ${docs[0]?.metadata.title}\nDescription: ${docs[0]?.metadata.description}\nTranscript: ${docs[0]?.pageContent}`;

    return final;
}

