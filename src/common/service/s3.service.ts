import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3BucketService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET!;

    this.s3 = new S3Client({
      region: process.env.S3_REGION!,
      endpoint: process.env.S3_ENDPOINT, // 🔥 important for Supabase
      forcePathStyle: true, // REQUIRED for Supabase S3 compatibility
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
    });
  }

  async uploadFileToS3(file: Express.Multer.File) {
    const fileKey = `${randomUUID()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      fileName: file.originalname,
      fileKey,
      filePath: `${process.env.S3_ENDPOINT}/${this.bucket}/${fileKey}`,
      fileSize: file.size,
    };
  }

  getObjectSignedUrl(key: string, expiresIn: number = 604_800) {
    const getObjectCmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3, getObjectCmd, { expiresIn });
  }
}
