import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("alumnos")
export class Alumno {
  @PrimaryColumn("int")
  id!: number;

  @Column({ type: "varchar", length: 15 })
  nia!: string;

  @Column({ name: "fecha_alta", type: "date", nullable: true })
  fechaAlta!: string | null;
}