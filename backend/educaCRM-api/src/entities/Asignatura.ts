import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("asignaturas")
export class Asignatura {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 100 })
  nombre!: string;

  @Column("varchar", { length: 20 })
  codigo!: string;

  @Column("varchar", { length: 20, nullable: true })
  curso!: string | null;
}