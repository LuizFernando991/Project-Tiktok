import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class CommentCreateInputDto {
  @Field()
  text: string

  @Field(() => Int)
  postId: number

  @Field(() => Int)
  userId: number
}
