import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { last } from "rxjs";
import { UserEntity } from "src/user/user.entity";
import { Not, Repository } from "typeorm";

@Injectable()
export class UserService {
    users: any;
    constructor(
        @InjectRepository(UserEntity) 
        private userRepo: Repository<UserEntity>
    ) {}
    
    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException("User not found");
        return user;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findOne({ where: { email } });
        return user;
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepo.find();
    }

    async create(data): Promise<UserEntity> {
        const user = {
            ...data
        }
        return this.userRepo.save(user);
    }
}
