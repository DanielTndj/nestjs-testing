import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('User Controller', () => {
  let userController: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'random' } as User]),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'daniel.tndj@gmail.com',
          password: '12345',
        } as User),
      // remove: (id: number) => {
      // },
      // update: () => {},
    };

    fakeAuthService = {
      // signUp: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
  });

  it('User controller should be defined', () =>
    expect(userController).toBeDefined());

  it('findAllUsersByEmail return a list of users with the given email', async () => {
    const users = await userController.findAllUsersByEmail(
      'daniel.tndj@gmail.com',
    );
    console.log(users);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('daniel.tndj@gmail.com');
  });

  it('findUser return a single user with the given id', async () => {
    const user = await userController.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throw NotFoundException an errorif user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    try {
      await userController.findUser('1');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toEqual('User not found');
    }
  });

  it('signin udpates session obj and return user', async () => {
    const session = { userId: null };
    const user = await userController.signIn(
      { email: 'daniel.tndj@gmail.com', password: '12345' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
