import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
  private readonly subject = new Subject<any>();

  stream$ = this.subject.asObservable();

  emit(data: any) {
    this.subject.next(data);
  }
}
