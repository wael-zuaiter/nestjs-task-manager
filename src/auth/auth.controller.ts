import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { AuthCredentialDto } from './dto/authCredential.dto';
import { AuthService } from './auth.service';
import { JwtResponse } from './dto/jwtResponse.interface';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    signUp(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<void> {
        this.logger.verbose(`Signup request is fired, with '${JSON.stringify(authCredentialDto)}'`);
        return this.authService.signUp(authCredentialDto);
    }

    @Post('signin')
    signIn(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<JwtResponse> {
        this.logger.verbose(`Signin request is fired, with '${JSON.stringify(authCredentialDto)}'`);
        return this.authService.signIn(authCredentialDto);
    }
}
