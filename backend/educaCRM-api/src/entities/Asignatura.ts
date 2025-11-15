import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { GrupoAsignatura } from "./GrupoAsignatura.js";
import { Calificacion } from "./Calificacion.js";

@Entity("asignaturas")
export class Asignatura {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "varchar", length: 20 })
  codigo!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  curso!: string | null;

  @OneToMany(() => GrupoAsignatura, (ga) => ga.asignatura)
  grupoAsignaturas!: GrupoAsignatura[];

  @OneToMany(() => Calificacion, (c) => c.asignatura)
  calificaciones!: Calificacion[];
}