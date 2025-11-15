import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Alumno } from "./Alumno.js";
import { Profesor } from "./Profesor.js";
import { Usuario } from "./Usuario.js";

@Entity("personas")
export class Persona {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 15 })
  dni!: string;

  @Column({ type: "varchar", length: 50 })
  nombre!: string;

  @Column({ type: "varchar", length: 100 })
  apellidos!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  telefono!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 150, nullable: true })
  direccion!: string | null;

  // Relaciones

  @OneToOne(() => Alumno, (a) => a.persona)
  alumno?: Alumno;

  @OneToOne(() => Profesor, (p) => p.persona)
  profesor?: Profesor;

  @OneToMany(() => Usuario, (u) => u.persona)
  usuarios?: Usuario[];
}