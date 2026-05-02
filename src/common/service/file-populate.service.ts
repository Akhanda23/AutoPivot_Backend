import { Injectable } from '@nestjs/common';
import { S3BucketService } from './s3.service';

/* eslint-disable */
@Injectable()
export class UrlPopulator {
  constructor(private readonly s3Service: S3BucketService) {}

  public async populate(
    data: any,
    fields: string[],
    expiresIn?: number,
  ): Promise<void> {
    if (!data) return;

    if (Array.isArray(data)) {
      for (const d of data) {
        await this.populate(d, fields, expiresIn);
      }
    } else if (typeof data === 'object' && Object.keys(data).length) {
      for (const k in data) {
        const value = data[k];
        if (!value) continue;
        if (
          Array.isArray(value) ||
          (typeof value === 'object' && Object.keys(value).length)
        ) {
          await this.populate(value, fields, expiresIn);
        } else {
          if (fields.includes(k)) {
            // If value is already an HTTPS URL, use it directly
            if (typeof value === 'string' && value.includes('https://')) {
              data[k + 'Url'] = value;
            } else {
              // Otherwise, fetch signed URL from S3
              data[k + 'Url'] = await this.s3Service.getObjectSignedUrl(
                value,
                expiresIn,
              );
            }
          }
        }
      }
    }
  }
}
/* eslint-enable */
