import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './dto/taskStatus.enum';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';
import { TaskStatusValidationPipe } from './pipes/taskStatusValidation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/dto/getUser.decorator';
import { User } from 'src/auth/user.entity';
import { ApiBearerAuth, ApiBasicAuth } from '@nestjs/swagger';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private tasksServices: TasksService) {}

    @ApiBearerAuth()
    @Get()
    getTasks(
        @Query(ValidationPipe) filtersDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User '${user.username}' trying to get all Tasks, with Filters: ${JSON.stringify(filtersDto)}`);
        return this.tasksServices.getTasks(filtersDto, user);
    }

    @ApiBearerAuth()
    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User    
    ): Promise<Task> {
        this.logger.verbose(`User '${user.username}' trying to get Task, with id: ${id}`);
        return this.tasksServices.getTaskById(id, user);
    }

    @ApiBearerAuth()
    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        this.logger.verbose(`User '${user.username}' trying to Task, with id: ${id}`);
        return this.tasksServices.deleteTask(id, user);
    }

    @ApiBearerAuth()
    @Patch('/:id/status')
    updateTaskById(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User '${user.username}' trying to update Task '${id}' status to '${status}'.`);
        return this.tasksServices.updateTaskById(id, status, user);
    }

    @ApiBearerAuth()
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User '${user.username}' trying to create a Task, with data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksServices.createTask(createTaskDto, user);
    }
}
