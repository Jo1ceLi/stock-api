import { Column } from 'typeorm';

class Instrument {
    @Column()
    assetType: string;

    @Column()
    cusip: string;

    @Column()
    symbol: string;

    @Column({ nullable: true })
    descripttion?: string;

    @Column({ nullable: true })
    putCall?: string;

    @Column({ nullable: true })
    underlyingSymbol?: string;
}
export default Instrument;
