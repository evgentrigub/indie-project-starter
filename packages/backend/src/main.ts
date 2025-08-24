import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });
  
  app.setGlobalPrefix('api');
  
  // Enable CORS for all origins
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.use(helmet());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Indie Project API')
    .setDescription('API documentation for the Indie Project')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('tasks', 'Task management endpoints')
    .addTag('billing', 'Subscription and billing endpoints')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customfavIcon: 'https://swagger.io/favicon-32x32.png',
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css'
  });
  
  const port = process.env.PORT || 3001;
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap(); 