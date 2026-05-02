import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { S3BucketService } from 'src/common/service/s3.service';
import { JwtService } from 'src/common/service/jwt.service';
import { CarAnalysisModule } from '../car-analysis/car-analysis.module';
import { PublisherModule } from '../publisher/publisher.module';

@Module({
  imports: [CarAnalysisModule, PublisherModule],
  controllers: [FileUploadController],
  providers: [JwtService, S3BucketService, FileUploadService],
})
export class FileUploadModule {}
