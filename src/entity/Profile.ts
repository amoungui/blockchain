import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    photo: string;

    @OneToOne(type => User, user => user.profile) // specify inverse side as a second parameter
    user: User;
}