import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Task } from '../../../modules/tasks/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @ApiProperty({
    enum: AuthProvider,
    example: 'local',
    description: 'The authentication provider',
  })
  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @ApiProperty({
    example: false,
    description: 'Whether the user has an active subscription',
  })
  @Column({ default: false })
  hasActiveSubscription: boolean;

  @ApiProperty({
    example: null,
    description: 'The Stripe customer ID',
  })
  @Column({ nullable: true })
  stripeCustomerId: string;

  @ApiProperty({
    example: null,
    description: 'The Stripe subscription ID',
  })
  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password && this.provider === AuthProvider.LOCAL) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password || this.provider !== AuthProvider.LOCAL) {
      return false;
    }
    return bcrypt.compare(password, this.password);
  }
} 