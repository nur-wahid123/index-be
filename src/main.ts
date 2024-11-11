import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './commons/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './commons/filters/http-exception.filter';
import { AppModule } from './app.module';
import { UserService } from './modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'debug', 'log'] });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port: number = +process.env.APP_PORT || 3000
  app.use(cookieParser());
  const userService = app.get(UserService);
  const corsDev: string[] = process?.env?.CORS_DEV?.split(',') ?? ['null'];
  const corsStg: string[] = process?.env?.CORS_STG?.split(',') ?? ['null'];
  app.setGlobalPrefix(`api/backend`);
  app.enableCors({
    origin: [...corsDev, ...corsStg],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'CONNECT', 'OPTIONS'],
    credentials: true,
  });
  if (process.env.NODE_ENV === 'development') {
    userService.init();
  }
  await app.listen(port, () => {
    console.log("listening to port : " + port);
    console.log("url : http://localhost:" + port);
  });
}
bootstrap();
