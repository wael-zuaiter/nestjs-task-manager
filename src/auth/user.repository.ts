import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialDto } from "./dto/authCredential.dto";
import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private logger = new Logger('UserRepository');

    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialDto;

        const user = new User();
        
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hash(password, user.salt);

        try {
            await user.save();
        }
        catch(error) {
            this.logger.error('\nSAVE ERROR', error);
            if(error.code === '23505') {
                throw new ConflictException('username already exists.')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<string> {
        const { username, password } = authCredentialDto;

        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}