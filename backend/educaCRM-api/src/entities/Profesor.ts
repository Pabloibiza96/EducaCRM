import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Persona } from "./Persona.js";
import { Departamento } from "./Departamento.js";
import { GrupoAsignatura } from "./GrupoAsignatura.js";

@Entity("profesores")
export class Profesor {
  // PK que es a la vez FK a personas.id
  @PrimaryColumn({ type: "int" })
  id!: number;

  @OneToOne(() => Persona, (p) => p.profesor, { eager: true })
  @JoinColumn({ name: "id" })
  persona!: Persona;

  @Column({ name: "fecha_alta", type: "date", nullable: true })
  fechaAlta!: string | null;

  @ManyToOne(() => Departamento, (d) => d.profesores, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: "departamento_id" })
  departamento!: Departamento | null;

  @OneToMany(() => GrupoAsignatura, (ga) => ga.profesor)
  grupoAsignaturas!: GrupoAsignatura[];
}