import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne, 
  JoinColumn
} from "typeorm";
import {Profile} from "./Profile";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["username"]) 
@Unique(["password"]) 
@Unique(["phone"]) 
@Unique(["email"]) 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  username: string;

  @Column()
  @Length(4, 20)
  phone: string ;

  @Column({ nullable: false})
  @Length(4, 20)
  email: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column({ default: "USER"})
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(type => Profile, profile => profile.user) // specify inverse side as a second parameter
  @JoinColumn()
  profile: Profile;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return <boolean> bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
