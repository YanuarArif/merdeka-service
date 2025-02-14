import { Client, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const storage = new Storage(client);

export const uploadToAppwrite = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file
    );
    // Return the public ID of the uploaded file for construct the URL
    return uploadedFile.$id;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getAppwriteImageUrl = (fileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/view?project_id=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};
