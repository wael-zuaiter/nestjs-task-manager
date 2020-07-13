import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';
import { TaskStatus } from './dto/taskStatus.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTask.dto';

const mockUser = {
    id: 3,
    username: 'Test Username'
}

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'search query' }
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('get task by id successfuly', async () => {
            const mockTask = { title: 'Test title', description: 'Test description' }
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id
                }
            });
        });

        it('get task by id not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(100, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('create task successfuly', async () => {
            const mockTask: CreateTaskDto = { title: 'Test title', description: 'Test description' }
            taskRepository.createTask.mockResolvedValue(mockTask);

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const result = await tasksService.createTask(mockTask, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser);
        });
    });

    describe('deleteTask', () => {
        it('delete task successfuly', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        });

        it('delete task not found', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTask(5, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTask', () => {
        it('update task', async () => {
            const mockStatus = TaskStatus.IN_PROGRESS;
            const save = jest.fn().mockResolvedValue(true);
            
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: mockStatus,
                save
            });

            const result = await tasksService.updateTaskById(1, mockStatus, mockUser);
            expect(result.status).toEqual(mockStatus);
        });
        
        it('get task by id not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(100, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});