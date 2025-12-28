import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ enum: ['FOUNDER', 'DEVELOPER', 'STUDENT', 'MENTOR', 'INVESTOR'], required: false })
    @IsOptional()
    @IsEnum(['FOUNDER', 'DEVELOPER', 'STUDENT', 'MENTOR', 'INVESTOR'])
    role?: string;
}

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
}
