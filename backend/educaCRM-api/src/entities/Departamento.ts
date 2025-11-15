import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("departamentos")
export class Departamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  nombre!: string;
}