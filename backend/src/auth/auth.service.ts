import { Response, Request } from 'express'
import {
  Injectable,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common'
import { User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { LoginDto, RegisterDto } from './dto'
import { PayloadType } from './types'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async refreshToken(req: Request, res: Response): Promise<string> {
    const refreshToken = req.cookies['refresh_token']

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found')
    }

    let payload: PayloadType

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
      })
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    })

    if (!userExists) {
      throw new BadRequestException('User no longer exists')
    }

    const expiresIn = 15000
    const expiration = Math.floor(Date.now() / 1000) + expiresIn

    const accessToken = this.jwtService.sign(
      { ...payload, exp: expiration },
      { secret: this.configService.get<string>('ACCESS_TOKEN_SECRET') }
    )

    res.cookie('access_token', accessToken, { httpOnly: true })

    return accessToken
  }

  private async issueTokens(user: User, res: Response) {
    const payload: PayloadType = { username: user.name, sub: user.id }

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '150sec'
      }
    )

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d'
    })

    res.cookie('access_token', accessToken, { httpOnly: true })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true
    })

    return { user }
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email }
    })
    if (!user) {
      return null
    }
    const comparePassword = await bcrypt.compare(
      loginDto.password,
      user.password
    )
    if (comparePassword) {
      return user
    }

    return null
  }

  async register(registerDto: RegisterDto, res: Response) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email }
    })
    if (existingUser)
      throw new BadRequestException({
        email: 'Email already used'
      })

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        password: hashedPassword,
        email: registerDto.email
      }
    })

    return this.issueTokens(user, res)
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto)

    if (!user) {
      throw new BadRequestException({
        password: 'Invalid email or password.'
      })
    }

    return this.issueTokens(user, response)
  }

  async logout(res: Response) {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    return 'Successfully logged out'
  }
}
