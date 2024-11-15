import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './modules/students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './commons/middlewares/logger.middleware';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { StudyGroupsModule } from './modules/study-groups/study-groups.module';
import { SemesterReportModule } from './modules/semester-report/semester-report.module';
import { typeOrmAsyncConfig } from './commons/configs/database.config';
import { UserService } from './modules/user/user.service';
import { UserRepository } from './repositories/user.repository';
import HashPassword from './commons/utils/hash-password.util';
import { AuthModule } from './modules/auth/auth.module';
import { ClassModule } from './modules/class/class.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    StudentsModule,
    SubjectsModule,
    StudyGroupsModule,
    SemesterReportModule,
    AuthModule,
    ClassModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, HashPassword, UserRepository],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
