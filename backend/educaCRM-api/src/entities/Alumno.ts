import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Persona } from "./Persona.js";
import { Matricula } from "./Matricula.js";
import { Calificacion } from "./Calificacion.js";

@Entity("alumnos")
export class Alumno {
  // PK que es a la vez FK a personas.id
  @PrimaryColumn({ type: "int" })
  id!: number;

  @OneToOne(() => Persona, (p) => p.alumno, { eager: true })
  @JoinColumn({ name: "id" })
  persona!: Persona;

  @Column({ type: "varchar", length: 15 })
  nia!: string;

  @Column({ name: "fecha_alta", type: "date", nullable: true })
  fechaAlta!: string | null;

  @OneToMany(() => Matricula, (m) => m.alumno)
  matriculas!: Matricula[];

  @OneToMany(() => Calificacion, (c) => c.alumno)
  calificaciones!: Calificacion[];
}