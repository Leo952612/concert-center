import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string;

  @Column()
  status: string;

  @Column()
  amount: number;

  @Column()
  customer_email: string;

  @Column({ nullable: true })
  wompi_transaction_id: string;

  @Column({ nullable: true })
  eventId: number;

  @Column({ nullable: true })
  quantity: number;
}