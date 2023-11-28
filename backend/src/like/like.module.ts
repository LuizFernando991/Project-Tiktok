import { Module } from '@nestjs/common'
import { LikeService } from './like.service'
import { LikeResolver } from './like.resolver'
import { ConfigModule } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
@Module({
  imports: [ConfigModule],
  providers: [LikeResolver, LikeService, JwtService]
})
export class LikeModule {}
