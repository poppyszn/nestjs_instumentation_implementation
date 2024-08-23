import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthMiddleware } from './auth.middleware';

async function bootstrap() {
  require('./instrumentation'); // Assuming the file is in the same directory

  const app = await NestFactory.create(AppModule);

  // Apply the AuthMiddleware globally
  app.use(new AuthMiddleware().use);

  await app.listen(3000);
}

bootstrap();
