import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [AuthService, JwtService],
  exports: [AuthService]
})
export class AuthModule {}
