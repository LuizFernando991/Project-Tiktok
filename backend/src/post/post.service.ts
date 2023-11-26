import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Post } from '@prisma/client'
import { createWriteStream } from 'fs'
import { extname } from 'path'
import { CreatePostDto } from './dto'
import { PostDetails, PostType } from './post.type'

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async saveVideo(video: {
    createReadStream: () => any
    filename: string
    mimetype: string
  }): Promise<string> {
    if (!video || !['video/mp4'].includes(video.mimetype)) {
      throw new BadRequestException(
        'Invalid video file format. Only MP4 is allowed.'
      )
    }

    const videoName = `${Date.now()}${extname(video.filename)}`

    const videoPath = `/files/${videoName}`

    const stream = video.createReadStream()

    const outputPath = `public${videoPath}`

    const writeStream = createWriteStream(outputPath)

    stream.pipe(writeStream)

    await new Promise((resolve, reject) => {
      stream.on('end', resolve)
      stream.on('error', reject)
    })

    return videoPath
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    return await this.prisma.post.create({
      data
    })
  }

  async getPostById(id: number): Promise<PostDetails> {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: { id },
        include: { user: true, likes: true, comments: true }
      })
      const postIds = await this.prisma.post.findMany({
        where: { userId: post.userId },
        select: { id: true }
      })

      return { ...post, otherPostIds: postIds.map((post) => post.id) }
    } catch (_) {
      throw new NotFoundException('Post not found.')
    }
  }

  async getPosts(skip: number, take: number): Promise<PostType[]> {
    // make sure that password won't be returned
    return await this.prisma.post.findMany({
      skip,
      take,
      include: { user: true, likes: true, comments: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getPostsByUserId(userId: number): Promise<PostType[]> {
    return await this.prisma.post.findMany({
      where: { userId },
      include: { user: true }
    })
  }

  async deletePost(id: number): Promise<PostDetails> {
    const post = await this.getPostById(id)
    try {
      const fs = await import('fs')
      fs.unlinkSync(`public${post.video}`)
      return await this.prisma.post.delete({
        where: { id },
        include: { user: true }
      })
    } catch (err) {
      throw new NotFoundException('Post not found.')
    }
  }
}
