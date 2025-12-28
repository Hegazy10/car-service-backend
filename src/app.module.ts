import { Module, ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';

const moduleMetadata: ModuleMetadata = {
  imports: [
    AuthModule,
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
