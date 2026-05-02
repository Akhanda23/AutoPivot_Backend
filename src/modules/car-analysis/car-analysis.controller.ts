import { Controller, Get, Param } from '@nestjs/common';
import { CarAnalysisService } from './car-analysis.service';

@Controller('car-analysis')
export class CarAnalysisController {
  constructor(private readonly carAnalysisService: CarAnalysisService) {}

  @Get(':id')
  getCarAnalysisResult(@Param('id') id: string) {
    return this.carAnalysisService.getCarAnalysisById(id);
  }
}
