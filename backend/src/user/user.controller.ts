import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('id')
    findById(@Param('id') id: string) {
        return this.userService.findById(id);
    } 

    @Get('email')
    findByEmail(@Param('email') email: string) {
        return this.userService.findByEmail(email);
    }
    @Get('all')
    findAll() {
        return this.userService.findAll();
    }
    
    @Post()
    create(@Body() body: any) {
        return this.userService.create(body);
    }
}
