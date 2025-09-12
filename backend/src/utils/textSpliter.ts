import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitter = async (text: any) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const doc = await textSplitter.createDocuments([text]);

    const docs =doc.map((chunk)=>{
        return{
            pageContent: chunk.pageContent,
        }
    })

    return docs;

}