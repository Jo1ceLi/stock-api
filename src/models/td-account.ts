import {
    BaseEntity, Column, Entity, ObjectID, ObjectIdColumn,
} from 'typeorm';
import Position from './position';

@Entity()
class TDAccount extends BaseEntity {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    accountId: string;

    @Column(() => Position)
    positions: Position[];
}
export default TDAccount;
