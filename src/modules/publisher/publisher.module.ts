import { Module } from '@nestjs/common';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { RabbitMQConfigModule } from 'src/common/config/rabbitmq.module';

@Module({
  imports: [RabbitMQConfigModule],
  controllers: [PublisherController],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
