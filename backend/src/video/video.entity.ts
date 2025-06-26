import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    filePath: string;
}
