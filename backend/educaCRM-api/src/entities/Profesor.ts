import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("profesores")
export class Profesor {
  // PK y FK a personas.id
  @PrimaryColumn("int")
  id!: number;

  @Column({ name: "fecha_alta", type: "date", nullable: true })
  fechaAlta!: string | null;

  @Column({ name: "departamento_id", type: "int", nullable: true })
  departamentoId!: number | null;
}