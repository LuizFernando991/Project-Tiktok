import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { Comment } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CommentCreateInputDto } from './dto'

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId
      },
      include: {
        user: true,
        post: true
      }
    })
  }

  async createComment(data: CommentCreateInputDto): Promise<Comment> {
    return this.prisma.comment.create({
      data,
      include: {
        user: true,
        post: true
      }
    })
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId
      }
    })

    if (!comment) return new NotFoundException('Comment not found.')

    if (comment.userId !== userId)
      throw new UnauthorizedException('Unauthorized.')

    return this.prisma.comment.delete({
      where: {
        id: commentId
      }
    })
  }
}
