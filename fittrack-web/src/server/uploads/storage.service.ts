import { randomUUID } from "crypto";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { BlobServiceClient } from "@azure/storage-blob";

export type StoredFile = {
  key: string;
  provider: "local" | "azure";
};

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "tmp_uploads");

function hasAzureConfig() {
  return Boolean(
    process.env.AZURE_STORAGE_CONNECTION_STRING && process.env.AZURE_STORAGE_CONTAINER_NAME,
  );
}

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

  if (hasAzureConfig()) {
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

  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, key), data);
  return { key, provider: "local" };
}

export async function getDownloadUrl(fileKey: string, provider: string): Promise<string | null> {
  if (provider === "azure" && hasAzureConfig()) {
    const containerClient = getAzureContainerClient();
    return containerClient.getBlockBlobClient(fileKey).url;
  }

  if (provider === "local") {
    return `/api/uploads/download/${encodeURIComponent(fileKey)}`;
  }

  return null;
}

export async function readLocalUploadedFile(fileKey: string): Promise<Buffer> {
  const fullPath = path.join(LOCAL_UPLOAD_DIR, fileKey);
  return readFile(fullPath);
}
