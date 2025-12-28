import { Module, ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { PrismaModule } from '../prisma/prisma.module';

const moduleMetadata: ModuleMetadata = {
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CarsModule,
    MaintenanceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'production'
          ? {
              level: 'info',
            }
          : {
              level: 'debug',
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  singleLine: true,
                },
              },
            },
    }),
  ],
};

@Module(moduleMetadata)
export class AppModule {}
