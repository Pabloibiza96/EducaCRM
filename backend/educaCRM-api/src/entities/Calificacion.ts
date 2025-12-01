import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Alumno } from "./Alumno.js";
import { Asignatura } from "./Asignatura.js";

export type Evaluacion = "1ª" | "2ª" | "3ª" | "Final";

@Entity("calificaciones")
export class Calificacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Alumno, (a) => a.calificaciones, { eager: true })
  @JoinColumn({ name: "alumno_id" })
  alumno!: Alumno;

  @ManyToOne(() => Asignatura, (a) => a.calificaciones, { eager: true })
  @JoinColumn({ name: "asignatura_id" })
  asignatura!: Asignatura;

  @Column({ type: "enum", enum: ["1ª", "2ª", "3ª", "Final"] })
  evaluacion!: Evaluacion;

  @Column({ type: "decimal", precision: 4, scale: 2, nullable: true })
  nota!: number | null;

  @Column({ type: "date", nullable: true })
  fecha!: string | null;
}
