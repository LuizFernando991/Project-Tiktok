import { Response, Request } from 'express'
import { Resolver, Mutation, Query, Args, Context, Int } from '@nestjs/graphql'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from './user.service'
import { LoginResponse, RegisterResponse } from 'src/auth/types'
import { LoginDto, RegisterDto } from 'src/auth/dto'
import { BadRequestException } from '@nestjs/common'
import { User } from './user.model'

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
}
