import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn, ObjectType } from "typeorm";
import { Position } from "./position";

@Entity()
export class TDAccount extends BaseEntity{
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    accountId: string;

    @Column(type => Position)
    positions: Position[];

}
