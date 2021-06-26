import {
    BaseEntity, Column, Entity, ObjectIdColumn,
} from 'typeorm';
import Instrument from './instrument';

@Entity()
class Position extends BaseEntity {
    @ObjectIdColumn()
    id: string;

    @Column({ nullable: false })
    averagePrice: number;

    @Column()
    currentDayProfitLoss: number;

    @Column()
    currentDayProfitLossPercentage: number;

    @Column()
    longQuantity: number;

    @Column()
    settledLongQuantity: number;

    @Column()
    settledShortQuantity: number;

    @Column()
    shortQuantity: number;

    @Column(() => Instrument)
    instrument: Instrument;

    @Column()
    marketValue: number;

    @Column()
    maintenanceRequirement: number;

    @Column()
    currentDayCost: number;

    @Column()
    previousSessionLongQuantity: number;
}

export default Position;
