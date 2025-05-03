import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'lib/common/database/prisma.service';
import { ProxyController } from './proxy/proxy.controller';

@Module({
  imports: [],
  controllers: [AppController, ProxyController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
