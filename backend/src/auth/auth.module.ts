import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaModule } from '../prisma/prisma.module'
import { JwtService } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [AuthService, JwtService],
  exports: [AuthService]
})
export class AuthModule {}
