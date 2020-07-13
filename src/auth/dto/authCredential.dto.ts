import { IsString, MinLength, MaxLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthCredentialDto {
    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z])/, {
        message: 'Password must have at least one lowercase and uppercase letter and special case letter'
    })
    password: string;
}

// ^                         Start anchor
// (?=.*[A-Z].*[A-Z])        Ensure string has two uppercase letters.
// (?=.*[!@#$&*])            Ensure string has one special case letter.
// (?=.*[0-9].*[0-9])        Ensure string has two digits.
// (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
// .{8}                      Ensure string is of length 8.
// $ 