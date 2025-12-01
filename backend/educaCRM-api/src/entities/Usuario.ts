import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Persona } from "./Persona.js";

export type RolUsuario =
  | "alumno"
  | "profesor"
  | "jefatura"
  | "direccion"
  | "administrador";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  username!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({
    type: "enum",
    enum: ["alumno", "profesor", "jefatura", "direccion", "administrador"],
  })
  rol!: RolUsuario;

  @ManyToOne(() => Persona, (p) => p.usuarios, { eager: true })
  @JoinColumn({ name: "persona_id" })
  persona!: Persona;
}
