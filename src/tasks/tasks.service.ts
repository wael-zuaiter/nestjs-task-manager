import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './dto/taskStatus.enum';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        private tasksRepository: TaskRepository,
    ) {}
    
    async getTasks(filters: GetTasksFilterDto, user: User): Promise<Task[]> {
        return await this.tasksRepository.getTasks(filters, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const foundTask = await this.tasksRepository.findOne({
            where: {
                id,
                userId: user.id
            }
        });

        if(!foundTask) {
            throw new NotFoundException(`Task with id '${id}' not found.`);
        }

        return foundTask;
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.tasksRepository.delete({ id, userId: user.id });

        if(result.affected === 0) {
            throw new NotFoundException(`Task with id '${id}' not found.`);
        }
    }

    async updateTaskById(
        id: number, 
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return await this.tasksRepository.createTask(createTaskDto, user);
    }
}
