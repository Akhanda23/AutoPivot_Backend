import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { QueueName } from 'src/common/config/rabbitmq.module';
import { CarAnalysisService } from '../car-analysis/car-analysis.service';
import { EventsService } from '../events/event.service';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly carAnalysisService: CarAnalysisService,
    private readonly eventsService: EventsService,
  ) {}

  private readonly logger = new Logger(ConsumerService.name);

  @RabbitSubscribe({
    exchange: 'car_events',
    routingKey: 'bg.done',
    queue: QueueName.BG_PROCESS,
  })
  async handleBgDone(data: unknown) {
    try {
      if (!data) {
        this.logger.warn('⚠️ [bg.done] Received empty data');
        return;
      }
      const parsed = <{ carId: string; bgKey: string }>(
        (typeof data === 'string' ? JSON.parse(data) : data)
      );
      await this.carAnalysisService.updateCarBackGroundRemoved(
        parsed.carId,
        parsed.bgKey,
      );

      // implement SSE
      this.eventsService.emit({
        id: parsed.carId,
        status: 'completed',
        isComplete: true,
      });
    } catch (err) {
      this.logger.error(`❌ [bg.done] Error: ${err}`);
      return new Nack(false); // nack without requeue
    }
  }

  // ─────────────────────────────────────────────
  // CAR_ANALYSIS Queue
  // ─────────────────────────────────────────────

  @RabbitSubscribe({
    exchange: 'car_events',
    routingKey: 'ai.done',
    queue: QueueName.CAR_ANALYSIS,
  })
  async handleAiDone(data: any) {
    try {
      this.logger.log(`📩 [ai.done] Received: ${JSON.stringify(data)}`);
      // 🧠 AI processing done — save results, trigger next step, etc.
      this.logger.log('🧠 AI processing done event handled');
    } catch (err) {
      this.logger.error(`❌ [ai.done] Error: ${err.message}`);
      return new Nack(false);
    }
  }

  // ─────────────────────────────────────────────
  // Shared — job.failed (both queues listen)
  // ─────────────────────────────────────────────


  @RabbitSubscribe({
    exchange: 'car_events',
    routingKey: 'job.failed',
    queue: QueueName.CAR_ANALYSIS,
  })
  async handleCarJobFailed(data: any) {
    try {
      this.logger.log(
        `📩 [job.failed → CAR_ANALYSIS] Received: ${JSON.stringify(data)}`,
      );
      // 💥 Handle failed car analysis job — alert, retry logic, etc.
      this.logger.log('💥 Car analysis job failed event handled');
    } catch (err) {
      this.logger.error(`❌ [job.failed → CAR_ANALYSIS] Error: ${err.message}`);
      return new Nack(false);
    }
  }
}
