import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Matricula } from "./Matricula.js";
import { GrupoAsignatura } from "./GrupoAsignatura.js";

@Entity("grupos")
export class Grupo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  nombre!: string;

  @Column({ type: "varchar", length: 20 })
  curso!: string;

  @OneToMany(() => Matricula, (m) => m.grupo)
  matriculas!: Matricula[];

  @OneToMany(() => GrupoAsignatura, (ga) => ga.grupo)
  gruposAsignaturas!: GrupoAsignatura[];
}
