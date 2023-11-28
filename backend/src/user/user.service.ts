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

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  async updateProfile(
    userId: number,
    data: { name?: string; bio?: string; image?: string }
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        image: data.image
      }
    })
  }
}
