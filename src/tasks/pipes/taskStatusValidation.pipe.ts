import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../dto/taskStatus.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS
    ];

    transform(value: any) {
        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is not a valid status`);
        }
        
        return value;
    }

    private isStatusValid(status: any) {
        if(this.allowedStatus.indexOf(status) !== -1) {
            return true;
        }

        return false;
    }
}