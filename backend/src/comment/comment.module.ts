import { Module } from '@nestjs/common'
import { CommentResolver } from './comment.resolver'
import { CommentService } from './comment.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [CommentResolver, CommentService, JwtService]
})
export class CommentModule {}
