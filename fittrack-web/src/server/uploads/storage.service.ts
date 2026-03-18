import { randomUUID } from "crypto";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type StoredFile = {
  key: string;
  provider: "local" | "s3";
};

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "tmp_uploads");

function hasS3Config() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_REGION &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY,
  );
}

function getS3Client() {
  const client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  });

  return client;
}

export async function storeCsvFile(fileName: string, data: Buffer): Promise<StoredFile> {
  const key = `${Date.now()}-${randomUUID()}-${fileName}`;

  if (hasS3Config()) {
    const client = getS3Client();
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: data,
        ContentType: "text/csv",
      }),
    );

    return { key, provider: "s3" };
  }

  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, key), data);
  return { key, provider: "local" };
}

export async function getDownloadUrl(fileKey: string, provider: string): Promise<string | null> {
  if (provider === "s3" && hasS3Config()) {
    const client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
    });
    return getSignedUrl(client, command, { expiresIn: 300 });
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
