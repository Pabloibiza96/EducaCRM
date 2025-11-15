import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("personas")
export class Persona {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 15, unique: true })
  dni!: string;

  @Column({ type: "varchar", length: 50 })
  nombre!: string;

  @Column({ type: "varchar", length: 100 })
  apellidos!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  telefono!: string | null;

  @Column({ type: "varchar", length: 100, unique: true, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 150, nullable: true })
  direccion!: string | null;
}