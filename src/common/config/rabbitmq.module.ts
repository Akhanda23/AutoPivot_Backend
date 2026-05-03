import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

export enum QueueName {
  IMAGE_UPLOAD = 'IMAGE_UPLOAD',
  BG_PROCESS = 'BG_PROCESS',
  CAR_ANALYSIS = 'CAR_ANALYSIS',
}

const EXCHANGE = 'car_events';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_URI,
      exchanges: [
        {
          name: EXCHANGE,
          type: 'topic',
          options: { durable: true },
        },
      ],
      queues: [
        // 1. INPUT: image upload
        {
          name: QueueName.IMAGE_UPLOAD,
          exchange: EXCHANGE,
          routingKey: 'image.upload',
          options: { durable: true },
        },

        // 2. BG removal result
        {
          name: QueueName.BG_PROCESS,
          exchange: EXCHANGE,
          routingKey: 'bg.done',
          options: { durable: true },
        },

        // 3. AI analysis result
        {
          name: QueueName.CAR_ANALYSIS,
          exchange: EXCHANGE,
          routingKey: 'ai.done',
          options: { durable: true },
        },
      ],
      connectionInitOptions: {
        wait: true, // important: waits for connection to be ready
        timeout: 20000, // 👈 increase timeout (20s recommended)
      },
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQConfigModule {}
