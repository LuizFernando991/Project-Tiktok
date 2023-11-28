import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PostModule } from './post/post.module'
import { LikeModule } from './like/like.module'
import { CommentModule } from './comment/comment.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res })
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/'
    }),
    ConfigModule.forRoot({}),
    AuthModule,
    UserModule,
    PostModule,
    LikeModule,
    PrismaModule,
    CommentModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
