import { Request } from 'express'
import { Context, Mutation, Resolver, Args, Query, Int } from '@nestjs/graphql'
import { PostService } from './post.service'
import { PostDetails, PostType } from './post.type'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { UseGuards } from '@nestjs/common'
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard'

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => PostType)
  async createPost(
    @Context() context: { req: Request },
    @Args({ name: 'video', type: () => GraphQLUpload }) video: GraphQLUpload,
    @Args('text') text: string
  ) {
    const userId = context.req.user.sub
    const videoPath = await this.postService.saveVideo(video)
    const postData = {
      text,
      video: videoPath,
      userId
    }
    return await this.postService.createPost(postData)
  }

  @Query(() => PostDetails)
  async getPostById(@Args('id') id: number) {
    return await this.postService.getPostById(id)
  }

  @Query(() => [PostType])
  async getPosts(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number
  ): Promise<PostType[]> {
    return await this.postService.getPosts(skip, take)
  }

  @Query(() => [PostType])
  async getPostsByUserId(@Args('userId') userId: number) {
    return await this.postService.getPostsByUserId(userId)
  }

  // add guard to verify user owner
  @Mutation(() => PostType)
  async deletePost(@Args('id', { type: () => Int }) id: number) {
    return await this.postService.deletePost(id)
  }
}
