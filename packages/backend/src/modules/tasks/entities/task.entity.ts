import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/users/entities/user.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity('tasks')
export class Task extends BaseEntity {
  @ApiProperty({
    example: 'Complete project documentation',
    description: 'The name of the task',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Write comprehensive documentation for the project including setup instructions',
    description: 'The description of the task',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'The status of the task',
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
} 