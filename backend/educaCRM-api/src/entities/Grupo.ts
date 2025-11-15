import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("grupos")
export class Grupo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 50 })
  nombre!: string;

  @Column("varchar", { length: 20 })
  curso!: string;
}