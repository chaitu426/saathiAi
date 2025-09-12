import ImageKit from "imagekit";
import {environment} from "../config/environment.js";

const imagekit = new ImageKit({
  publicKey: environment.publicKey!,
  privateKey: environment.privateKey!,
  urlEndpoint: environment.urlEndpoint!,
});

export const uploadToImageKit = async (fileBuffer: Buffer, fileName: string, folder: string = "/uploads") => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder,
    });

    return {
      success: true,
      url: result.url,
      thumbnail: result.thumbnailUrl,
      fileId: result.fileId,
    };
  } catch (error: any) {
    console.error("ImageKit Upload Error:", error);
    throw new Error(error.message || "Failed to upload file");
  }
};
