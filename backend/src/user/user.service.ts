import { User } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(limit?: number): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        posts: true
      },
      take: limit
    })
  }
}
