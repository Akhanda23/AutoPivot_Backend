import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { RabbitMQConfigModule } from 'src/common/config/rabbitmq.module';
import { CarAnalysisModule } from '../car-analysis/car-analysis.module';
import { EventModule } from '../events/event.module';

@Module({
  imports: [RabbitMQConfigModule, CarAnalysisModule, EventModule],
  providers: [ConsumerService],
})
export class ConsumerModule {}
