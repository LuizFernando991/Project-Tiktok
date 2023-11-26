import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field()
  id?: number

  @Field()
  name: string

  @Field()
  email?: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  image: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
