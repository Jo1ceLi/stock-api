import { Instrument } from './instrument';
import { BaseEntity, Column, Entity, ObjectIdColumn, ObjectType } from "typeorm";

@Entity()
export class Position extends BaseEntity{

    // constructor(averagePrice: number) {
    //     super();
    //     this.averagePrice = averagePrice;
    // }
    @ObjectIdColumn()
    id: string;

    @Column({nullable: false})
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
    
    @Column(_ => Instrument)
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

