import { Injectable } from '@nestjs/common';
import { EventsService } from './modules/events/event.service';

@Injectable()
export class AppService {
  constructor(private readonly eventsService: EventsService) {}
  getHello(): string {
    return 'Hello World!';
  }
}
