import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'

import { AuthModule } from 'src/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [UserService, UserResolver, JwtService],
  exports: [UserService]
})
export class UserModule {}
