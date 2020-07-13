import { TaskStatus } from "./taskStatus.enum";
import { IsOptional, IsNotEmpty, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetTasksFilterDto {
    @ApiProperty({ enum: TaskStatus })
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    search: string;
}