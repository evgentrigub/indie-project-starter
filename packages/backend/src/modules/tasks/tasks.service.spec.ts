import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: any;

  const mockTask: Partial<Task> = {
    id: '1',
    name: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
      };

      repository.create.mockReturnValue(mockTask);
      repository.save.mockResolvedValue(mockTask);

      const result = await service.create('user1', createTaskDto);
      expect(result).toEqual(mockTask);
      expect(repository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        userId: 'user1',
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const tasks = [mockTask, { ...mockTask, id: '2' }];
      repository.find.mockResolvedValue(tasks);

      const result = await service.findAll('user1');
      expect(result).toEqual(tasks);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task if found and owned by user', async () => {
      repository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('1', 'user1');
      expect(result).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', 'user1'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task not owned by user', async () => {
      const otherUserTask = { ...mockTask, userId: 'user2' };
      repository.findOne.mockResolvedValue(otherUserTask);

      await expect(service.findOne('1', 'user1'))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        name: 'Updated Task',
        description: 'Updated Description',
        status: TaskStatus.IN_PROGRESS,
      };

      repository.findOne.mockResolvedValue(mockTask);
      repository.save.mockResolvedValue({ ...mockTask, ...updateTaskDto });

      const result = await service.update('1', 'user1', updateTaskDto);
      expect(result).toEqual({ ...mockTask, ...updateTaskDto });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockTask,
        ...updateTaskDto,
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('1', 'user1', {}))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task not owned by user', async () => {
      const otherUserTask = { ...mockTask, userId: 'user2' };
      repository.findOne.mockResolvedValue(otherUserTask);

      await expect(service.update('1', 'user1', {}))
        .rejects
        .toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      repository.findOne.mockResolvedValue(mockTask);
      repository.remove.mockResolvedValue(mockTask);

      await service.remove('1', 'user1');
      expect(repository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('1', 'user1'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task not owned by user', async () => {
      const otherUserTask = { ...mockTask, userId: 'user2' };
      repository.findOne.mockResolvedValue(otherUserTask);

      await expect(service.remove('1', 'user1'))
        .rejects
        .toThrow(ForbiddenException);
    });
  });
}); 