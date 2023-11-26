import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'

import { AuthModule } from 'src/auth/auth.module'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
