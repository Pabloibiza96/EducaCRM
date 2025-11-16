import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Profesor } from "./Profesor.js";

@Entity("departamentos")
export class Departamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  nombre!: string;

  @OneToMany(() => Profesor, (p) => p.departamento)
  profesores!: Profesor[];


}