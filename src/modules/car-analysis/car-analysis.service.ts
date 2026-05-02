import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarAnalysisEntity } from './car-analysis.entity';
import { Repository } from 'typeorm';
import { UrlPopulator } from 'src/common/service/file-populate.service';

@Injectable()
export class CarAnalysisService {
  constructor(
    @InjectRepository(CarAnalysisEntity)
    private readonly carAnalysisRepository: Repository<CarAnalysisEntity>,
    private readonly urlPopulator: UrlPopulator,
  ) {}

  async uploadCarImage(fileUrl: string, userId: string) {
    const savedData = await this.carAnalysisRepository
      .create({
        originalFileKey: fileUrl,
        user: { id: userId },
        userId: userId,
      })
      .save();
    return savedData;
  }

  async updateCarBackGroundRemoved(
    carAnalysisId: string,
    bgRemovedFileKey: string,
  ) {
    const carAnalysis = await this.carAnalysisRepository.findOneBy({
      id: carAnalysisId,
    });
    if (!carAnalysis) {
      throw new Error('Car analysis record not found');
    }
    carAnalysis.bgRemovedFileKey = bgRemovedFileKey;
    await carAnalysis.save();
  }

  async getCarAnalysisById(id: string) {
    const result = await this.carAnalysisRepository.findOneBy({ id });
    await this.urlPopulator.populate(result, [
      'originalFileKey',
      'bgRemovedFileKey',
    ]);
    return result;
  }
}
