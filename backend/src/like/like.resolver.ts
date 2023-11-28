import { Request } from 'express'
import { Resolver, Mutation, Args, Context, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GraphqlAuthGuard } from '../auth/graphql-auth.guard'
import { LikeService } from './like.service'
import { LikeType } from './like.type'

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => LikeType)
  @UseGuards(GraphqlAuthGuard)
  async likePost(
    @Args('postId', { type: () => Int }) postId: number,
    @Context() ctx: { req: Request }
  ) {
    return this.likeService.likePost({
      userId: ctx.req.user.sub,
      postId: postId
    })
  }

  @Mutation(() => LikeType)
  @UseGuards(GraphqlAuthGuard)
  async unlikePost(
    @Args('postId', { type: () => Int }) postId: number,
    @Context() ctx: { req: Request }
  ) {
    return this.likeService.unlikePost(postId, ctx.req.user.sub)
  }
}
