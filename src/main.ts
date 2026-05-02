import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => {
    console.log('✅ HTTP server running on port 3000');
    console.log('✅ RabbitMQ consumers listening on all queues');
  })
  .catch((err) => {
    console.error('❌ Error starting:', err);
    process.exit(1);
  });
