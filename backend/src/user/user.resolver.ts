import { Response, Request } from 'express'
import { Resolver, Mutation, Query, Args, Context, Int } from '@nestjs/graphql'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from './user.service'
import { LoginResponse, RegisterResponse } from 'src/auth/types'
import { LoginDto, RegisterDto } from 'src/auth/dto'
import { BadRequestException, UseGuards } from '@nestjs/common'
import { User } from './user.model'
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import { createWriteStream } from 'fs'

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response }
  ): Promise<RegisterResponse> {
    const { user } = await this.authService.register(registerDto, context.res)
    return { user }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response }
  ) {
    return this.authService.login(loginDto, context.res)
  }

  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    return this.authService.logout(context.res)
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    try {
      return this.authService.refreshToken(context.req, context.res)
    } catch (err) {
      throw new BadRequestException(err.message)
    }
  }

  @Query(() => [User])
  async getUsers(@Args('take', { type: () => Int }) take: number) {
    return this.userService.getUsers(take)
  }

  @Query(() => User)
  async getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getUserById(id)
  }

  @Mutation(() => User)
  @UseGuards(GraphqlAuthGuard)
  async updateUserProfile(
    @Context()
    context: { req: Request },
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('bio', { type: () => String, nullable: true }) bio?: string,
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image?: GraphQLUpload
  ) {
    let imageUrl: string
    if (image) {
      imageUrl = await this.storeImageAndGetURL(image)
    }
    return this.userService.updateProfile(context.req.user.sub, {
      name,
      bio,
      image: imageUrl
    })
  }

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file
    const uniqueFilename = `${uuidv4()}_${filename}`
    const imagePath = join(process.cwd(), 'public/files', uniqueFilename)
    const imageUrl = `/files/${uniqueFilename}`
    const readStream = createReadStream()
    readStream.pipe(createWriteStream(imagePath))

    return imageUrl
  }
}
