import { BaseEntity, Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class User extends BaseEntity{
    @ObjectIdColumn()
    id: string;

    @Column({nullable: false, unique: true})
    email: string;
    
    @Column({nullable: false})
    password: string;

    @Column({nullable: false})
    userName: string;
}