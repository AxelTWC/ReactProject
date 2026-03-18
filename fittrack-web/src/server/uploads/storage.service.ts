import { randomUUID } from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";

export type StoredFile = {
  key: string;
  provider: "azure";
};

function getAzureContainerClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
  if (!connectionString || !containerName) {
    throw new Error("Azure Blob storage is not configured");
  }

  const serviceClient = BlobServiceClient.fromConnectionString(connectionString);
  return serviceClient.getContainerClient(containerName);
}

export async function storeCsvFile(fileName: string, data: Buffer): Promise<StoredFile> {
  const key = `${Date.now()}-${randomUUID()}-${fileName}`;

  const containerClient = getAzureContainerClient();
  await containerClient.createIfNotExists();

  const blobClient = containerClient.getBlockBlobClient(key);
  await blobClient.uploadData(data, {
    blobHTTPHeaders: {
      blobContentType: "text/csv",
    },
  });

  return { key, provider: "azure" };
}

export async function readAzureUploadedFile(fileKey: string): Promise<Buffer> {
  const containerClient = getAzureContainerClient();
  const blobClient = containerClient.getBlockBlobClient(fileKey);
  const result = await blobClient.downloadToBuffer();
  return Buffer.isBuffer(result) ? result : Buffer.from(result);
}
