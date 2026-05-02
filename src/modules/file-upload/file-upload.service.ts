import { Injectable } from '@nestjs/common';
import { UserI } from 'src/common/interfaces/global.interface';
import { S3BucketService } from 'src/common/service/s3.service';
import { CarAnalysisService } from '../car-analysis/car-analysis.service';
import { PublisherService } from '../publisher/publisher.service';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly s3BucketService: S3BucketService,
    private readonly carAnalysisService: CarAnalysisService,

    private readonly publisherService: PublisherService,
  ) {}

  async uploadFile(user: UserI, file: Express.Multer.File) {
    const fileData = await this.s3BucketService.uploadFileToS3(file);
    const savedData = await this.carAnalysisService.uploadCarImage(
      fileData.fileKey,
      user.id,
    );

    const queueData = {
      carAnalysisId: savedData.id,
      fileKey: fileData.fileKey,
    };
    await this.publisherService.publishToBGRemove(queueData);
    return { fileData, savedData };
  }
}
