import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator'

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string
}

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must be a string.' })
  name: string

  @Field()
  @IsNotEmpty({ message: 'Password is required. ' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string

  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string
}
