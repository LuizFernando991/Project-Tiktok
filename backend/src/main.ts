import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
// import { ApolloError } from 'apollo-server-express'
import * as cookieParser from 'cookie-parser'
import { GraphQLErrorFilter } from './filters/custom-exception.filter'
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
    // all headers that client are allowed to use
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight'
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
  })

  app.use(cookieParser())

  app.use(graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 10 }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = Object.values(error.constraints).join(
            ', '
          )
          return accumulator
        }, {})
        // return formatted errors being an object with properties mapping to errors
        throw new BadRequestException(formattedErrors)
      }
    })
  )

  app.useGlobalFilters(new GraphQLErrorFilter())

  await app.listen(process.env.PORT)
}
bootstrap()
