import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/authCredential.dto';
import { InternalServerErrorException, ConflictException } from '@nestjs/common';
import { User } from './user.entity';

describe('UserRepository', () => {
    let userRepository;

    const mockCredential: AuthCredentialDto = {
        username: 'Test Username',
        password: '123Test#'
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('SignUp User', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });
        
        it('user signup successfuly', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredential)).resolves.not.toThrow();
        });

        it('user signup already exist', () => {
            save.mockRejectedValue({ code: '23505' });
            expect(userRepository.signUp(mockCredential)).rejects.toThrow(ConflictException);
        });

        it('user signup faild', () => {
            save.mockRejectedValue({ code: '11111' });
            expect(userRepository.signUp(mockCredential)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('SignIn User', () => {
        let user;

        beforeEach(() => {
            user = new User();
            user.username = 'Test Username';
            user.validatePassword = jest.fn();
            userRepository.findOne = jest.fn();
        });

        it('user signin successfuly', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            expect(await userRepository.validateUserPassword(mockCredential)).toEqual(mockCredential.username);
        });

        it('user not found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(await userRepository.validateUserPassword(mockCredential)).toBeNull();
        });

        it('user signin wrong password', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            expect(await userRepository.validateUserPassword(mockCredential)).toBeNull();
        });
    });
});