import { Controller, Sse, Query } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { EventsService } from './event.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('stream')
  stream() {
    return this.eventsService.stream$.pipe(
      map((data) => {
        console.log('📡 SSE EMIT:', data);
        return { data };
      }),
    );
  }
}
