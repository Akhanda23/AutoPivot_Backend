import { Controller, Get } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get()
  async publishMessage() {
    // Logic to publish a message to RabbitMQ
    // await this.publisherService.publishNotification({ id: 1, name: 'Fluffy' });
    return 'Message published to RabbitMQ!';
  }
}
