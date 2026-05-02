import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PublisherService implements OnModuleInit {
  private readonly logger = new Logger(PublisherService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  onModuleInit() {
    this.logger.log('✅ PublisherService connected to RabbitMQ');
  }

  async publishToBGRemove(data: any) {
    try {
      const result = await this.amqpConnection
        .publish('car_events', 'image.upload', data)
        .catch((err) => {
          this.logger.error(`❌ [IMAGE_PROCESS] Publish failed: ${err}`);
        });
      console.log('Published to IMAGE_PROCESS queue:', result);
    } catch (err) {
      this.logger.error(`❌ [cats_queue] Publish failed: ${err}`);
    }
  }
}
