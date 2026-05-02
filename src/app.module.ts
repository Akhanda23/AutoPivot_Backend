import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/config/config.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { ConsumerModule } from './modules/consumer/consumer.module';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { CarAnalysisModule } from './modules/car-analysis/car-analysis.module';
import { CorsMiddleware } from './common/middlewares/cors.middleware';
import { EventModule } from './modules/events/event.module';

@Module({
  imports: [
    ConfigModule,
    PublisherModule,
    ConsumerModule,
    UserModule,
    FileUploadModule,
    CarAnalysisModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
