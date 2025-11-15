import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Grupo } from "./Grupo.js";
import { Asignatura } from "./Asignatura.js";
import { Profesor } from "./Profesor.js";

@Entity("grupo_asignatura")
export class GrupoAsignatura {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Grupo, (g) => g.grupoAsignaturas, { eager: true })
  @JoinColumn({ name: "grupo_id" })
  grupo!: Grupo;

  @ManyToOne(() => Asignatura, (a) => a.grupoAsignaturas, { eager: true })
  @JoinColumn({ name: "asignatura_id" })
  asignatura!: Asignatura;

  @ManyToOne(() => Profesor, (p) => p.grupoAsignaturas, { eager: true })
  @JoinColumn({ name: "profesor_id" })
  profesor!: Profesor;
}