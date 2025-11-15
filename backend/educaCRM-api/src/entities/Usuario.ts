import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type RolUsuario = "alumno" | "profesor" | "jefatura" | "direccion" | "administrador";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, unique: true })
  username!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({
    type: "enum",
    enum: ["alumno", "profesor", "jefatura", "direccion", "administrador"],
  })
  rol!: RolUsuario;

  @Column({ name: "persona_id", type: "int" })
  personaId!: number;
}