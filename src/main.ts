import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'debug', 'log'] });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useGlobalFilters(new HttpExceptionFilter());
  const port: number = +process.env.APP_PORT || 3000
  app.use(cookieParser());
  const corsDev: string[] = process?.env?.CORS_DEV?.split(',') ?? ['null'];
  const corsStg: string[] = process?.env?.CORS_STG?.split(',') ?? ['null'];
  app.enableCors({
    origin: [...corsDev, ...corsStg],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'CONNECT', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(port, () => {
    console.log("listening to port : " + port);
    console.log("url : http://localhost:" + port);
  });
}
bootstrap();
