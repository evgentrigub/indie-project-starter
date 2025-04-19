import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, AuthProvider } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    provider: AuthProvider.LOCAL,
    hasActiveSubscription: false,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    validatePassword: jest.fn().mockResolvedValue(true),
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(service.validateUser('test@example.com', 'password'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const invalidUser = { ...mockUser, validatePassword: jest.fn().mockResolvedValue(false) };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(invalidUser as User);

      await expect(service.validateUser('test@example.com', 'wrongPassword'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return token response for valid credentials', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const result = await service.login(loginDto);
      expect(result).toEqual({
        accessToken: 'mockToken',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          hasActiveSubscription: mockUser.hasActiveSubscription,
        },
      });
    });
  });

  describe('register', () => {
    it('should create user and return token response', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as User);

      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const result = await service.register(createUserDto);
      expect(result).toEqual({
        accessToken: 'mockToken',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          hasActiveSubscription: mockUser.hasActiveSubscription,
        },
      });
    });
  });

  describe('validateOAuthUser', () => {
    it('should return existing user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);

      const result = await service.validateOAuthUser('test@example.com', AuthProvider.GOOGLE);
      expect(result).toEqual(mockUser);
    });

    it('should create new user if not exists', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as User);

      const result = await service.validateOAuthUser('test@example.com', AuthProvider.GOOGLE);
      expect(result).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalled();
    });
  });

  describe('googleLogin', () => {
    it('should return token response for valid Google user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);

      const result = await service.googleLogin({ email: 'test@example.com' });
      expect(result).toEqual({
        accessToken: 'mockToken',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          hasActiveSubscription: mockUser.hasActiveSubscription,
        },
      });
    });

    it('should throw UnauthorizedException if no user from Google', async () => {
      await expect(service.googleLogin(null))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
}); 