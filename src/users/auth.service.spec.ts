import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // fakeUsersService = {
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) =>
    //     Promise.resolve({ id: 1, email, password } as User),
    // };
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('Should create an instance of auth service', async () =>
    expect(authService).toBeDefined());

  it('Should create a new user & password are salted & hashed', async () => {
    const { password } = await authService.signUp('tes@gmail.com', 'tes');

    expect(password).not.toEqual('tes');
    const [salt, hash] = password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Should throws an BadRequestException if user sign up with email that is in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'a@gmail.com', password: '123' } as User,
    //   ]);

    await authService.signUp('a@gmail.com', 'tes');

    // expect.assertions(2);

    try {
      await authService.signUp('a@gmail.com', 'tes');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toBe('Email already in use');
    }
  });

  it('Should throws an NotFoundException if user try to login with unused email', async () => {
    try {
      await authService.signIn('klwjefli@kjdfjwe.com', 'sfawe');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('User not found');
    }
  });

  it('Should throws an ForbiddenException if password is not match', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'asdf@gmail.com',
    //       password: 'asdewqfdewqfewqf',
    //     } as User,
    //   ]);
    await authService.signUp('asdf@gmail.com', 'asdf');
    let user;

    try {
      user = await authService.signIn('asdf@gmail.com', 'sdf');
      expect(user).not.toBeDefined();
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
      expect(e.message).toBe('Wrong password');
    }
  });

  it('Should return a user if password is correct', async () => {
    await authService.signUp('qwerty@gmail.com', 'qwerty');
    const user = await authService.signIn('qwerty@gmail.com', 'qwerty');

    expect(user).toBeDefined();
  });
});
