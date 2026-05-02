import { Module } from '@nestjs/common';
import { ConfigModule as EnvConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './data-source';

@Module({
  imports: [
    EnvConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSource.options,
      dataSourceFactory: (options) => {
        return dataSource.setOptions(options!).initialize();
      },
    }),
  ],
  exports: [],
})
export class ConfigModule {}
