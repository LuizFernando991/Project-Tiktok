import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { LikeCreateInput } from './dto'

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost(data: LikeCreateInput) {
    try {
      return this.prisma.like.create({ data })
    } catch {
      return new BadRequestException('Unable to create like')
    }
  }

  async unlikePost(postId: number, userId: number) {
    try {
      return this.prisma.like.delete({
        where: { userId_postId: { postId, userId } }
      })
    } catch {
      return new BadRequestException('Like do not found')
    }
  }
}
