import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Alumno } from "./Alumno.js";
import { Grupo } from "./Grupo.js";

@Entity("matriculas")
export class Matricula {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Alumno, { eager: true })
  @JoinColumn({ name: "alumno_id" })
  alumno!: Alumno;

  @ManyToOne(() => Grupo, { eager: true })
  @JoinColumn({ name: "grupo_id" })
  grupo!: Grupo;

  @Column("date", { nullable: true })
  fecha!: string | null;
}