import {
    BaseEntity, Column, Entity, ObjectIdColumn,
} from 'typeorm';

@Entity()
class User extends BaseEntity {
    @ObjectIdColumn()
    id: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    userName: string;

    @Column()
    tdAccountId: string[];
}
export default User;
