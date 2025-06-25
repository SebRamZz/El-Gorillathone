import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Prompt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    text: string;
}
