import { Request } from 'express'
import { Resolver, Args, Context, Query, Int, Mutation } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard'
import { CommentService } from './comment.service'
import { Comment } from './comment.type'

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment])
  async getCommentsByPostId(
    @Args('postId', { type: () => Int }) postId: number
  ) {
    return this.commentService.getCommentsByPostId(postId)
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @Args('postId', { type: () => Int }) postId: number,
    @Args('text') text: string,
    @Context() ctx: { req: Request }
  ) {
    const userId = ctx.req.user.sub
    return this.commentService.createComment({
      text,
      userId,
      postId
    })
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  deleteComment(
    @Args('id', { type: () => Int }) id: number,
    @Context() ctx: { req: Request }
  ) {
    const userId = ctx.req.user.sub
    return this.commentService.deleteComment(id, userId)
  }
}
