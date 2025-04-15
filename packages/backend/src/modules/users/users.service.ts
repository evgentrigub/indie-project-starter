import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    
    Object.assign(user, updateData);
    
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User> {
    return this.update(userId, { stripeCustomerId });
  }

  async updateSubscriptionStatus(userId: string, isActive: boolean, subscriptionId?: string): Promise<User> {
    const updateData: Partial<User> = { 
      hasActiveSubscription: isActive 
    };
    
    if (subscriptionId) {
      updateData.stripeSubscriptionId = subscriptionId;
    }
    
    return this.update(userId, updateData);
  }

  async findByStripeCustomerId(stripeCustomerId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { stripeCustomerId } 
    });
    
    if (!user) {
      throw new NotFoundException(`User with Stripe customer ID ${stripeCustomerId} not found`);
    }
    
    return user;
  }
} 