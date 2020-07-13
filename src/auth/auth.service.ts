import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/authCredential.dto';
import { JwtResponse } from './dto/jwtResponse.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwtPayload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.signUp(authCredentialDto);
    }

    async signIn(authCredentialDto: AuthCredentialDto): Promise<JwtResponse> {
        const username = await this.userRepository.validateUserPassword(authCredentialDto);

        if(!username) throw new UnauthorizedException(`Invalid credential`);

        const payload: JwtPayload = { username };

        const accessToken = await this.jwtService.sign(payload);

        return { accessToken }
    }
}
