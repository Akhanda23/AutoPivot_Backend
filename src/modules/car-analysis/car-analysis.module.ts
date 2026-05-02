import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarAnalysisEntity } from './car-analysis.entity';
import { CarAnalysisController } from './car-analysis.controller';
import { CarAnalysisService } from './car-analysis.service';
import { S3BucketService } from 'src/common/service/s3.service';
import { UrlPopulator } from 'src/common/service/file-populate.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarAnalysisEntity])],
  controllers: [CarAnalysisController],
  providers: [S3BucketService, UrlPopulator, CarAnalysisService],
  exports: [CarAnalysisService],
})
export class CarAnalysisModule {}
