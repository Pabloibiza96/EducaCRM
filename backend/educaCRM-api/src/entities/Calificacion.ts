import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Alumno } from "./Alumno.js";
import { Asignatura } from "./Asignatura.js";

export type EvaluacionTipo = "1ª" | "2ª" | "3ª" | "Final";

@Entity("calificaciones")
export class Calificacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Alumno, { eager: true })
  @JoinColumn({ name: "alumno_id" })
  alumno!: Alumno;

  @ManyToOne(() => Asignatura, { eager: true })
  @JoinColumn({ name: "asignatura_id" })
  asignatura!: Asignatura;

  @Column({
    type: "enum",
    enum: ["1ª", "2ª", "3ª", "Final"],
  })
  evaluacion!: EvaluacionTipo;

  @Column("decimal", { precision: 4, scale: 2, nullable: true })
  nota!: number | null;

  @Column({ type: "date", nullable: true })
  fecha!: string | null; // Date en string ISO (YYYY-MM-DD) está bien
}