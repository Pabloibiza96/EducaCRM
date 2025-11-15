import { Repository } from "typeorm";
import { AppDataSource } from "../data-source.js";
import { Profesor } from "../entities/Profesor.js";
import { Persona } from "../entities/Persona.js";
import { Departamento } from "../entities/Departamento.js";

export interface ProfesorDTO {
  id: number;
  fechaAlta: string | null;
  nombre: string;
  apellidos: string;
  email: string | null;
  telefono: string | null;
  departamento: string | null;
  departamentoId: number | null;
}

export interface ProfesorCreateUpdateDTO {
  nombre: string;
  apellidos: string;
  email?: string | null;
  telefono?: string | null;
  departamentoId?: number | null;
}

export class ProfesorService {
  private profesorRepo: Repository<Profesor>;
  private personaRepo: Repository<Persona>;
  private departamentoRepo: Repository<Departamento>;

  constructor() {
    this.profesorRepo = AppDataSource.getRepository(Profesor);
    this.personaRepo = AppDataSource.getRepository(Persona);
    this.departamentoRepo = AppDataSource.getRepository(Departamento);
  }

  private toDTO(p: Profesor): ProfesorDTO {
    return {
      id: p.id,
      fechaAlta: p.fechaAlta,
      nombre: p.persona?.nombre ?? "",
      apellidos: p.persona?.apellidos ?? "",
      email: p.persona?.email ?? null,
      telefono: p.persona?.telefono ?? null,
      departamento: p.departamento?.nombre ?? null,
      departamentoId: p.departamento?.id ?? null,
    };
  }

  async getAll(): Promise<ProfesorDTO[]> {
    const profesores = await this.profesorRepo.find({
      relations: ["persona", "departamento"],
      order: { id: "ASC" },
    });
    return profesores.map((p) => this.toDTO(p));
  }

  async getOne(id: number): Promise<ProfesorDTO | null> {
    const profesor = await this.profesorRepo.findOne({
      where: { id },
      relations: ["persona", "departamento"],
    });
    return profesor ? this.toDTO(profesor) : null;
  }

  async create(data: ProfesorCreateUpdateDTO): Promise<ProfesorDTO> {
    // 1) Crear persona
    const persona = this.personaRepo.create({
      dni: `TMP-${Date.now().toString().slice(-8)}`,
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email ?? null,
      telefono: data.telefono ?? null,
      direccion: null,
    });
    await this.personaRepo.save(persona);

    // 2) Buscar departamento si se proporciona
    let departamento: Departamento | null = null;
    if (data.departamentoId) {
      departamento = await this.departamentoRepo.findOne({
        where: { id: data.departamentoId },
      });
    }

    // 3) Crear profesor
    const profesor = this.profesorRepo.create({
      id: persona.id,
      persona,
      fechaAlta: new Date().toISOString().slice(0, 10),
      departamento,
    });
    await this.profesorRepo.save(profesor);

    // 4) Recargar con relaciones
    const recargado = await this.profesorRepo.findOneOrFail({
      where: { id: profesor.id },
      relations: ["persona", "departamento"],
    });

    return this.toDTO(recargado);
  }

  async update(
    id: number,
    data: ProfesorCreateUpdateDTO
  ): Promise<ProfesorDTO | null> {
    const profesor = await this.profesorRepo.findOne({
      where: { id },
      relations: ["persona", "departamento"],
    });

    if (!profesor) return null;

    // Actualizar persona
    profesor.persona.nombre = data.nombre;
    profesor.persona.apellidos = data.apellidos;
    profesor.persona.email = data.email ?? profesor.persona.email;
    profesor.persona.telefono = data.telefono ?? profesor.persona.telefono;
    await this.personaRepo.save(profesor.persona);

    // Actualizar departamento
    if (data.departamentoId !== undefined) {
      if (data.departamentoId === null) {
        profesor.departamento = null;
      } else {
        const departamento = await this.departamentoRepo.findOne({
          where: { id: data.departamentoId },
        });
        if (departamento) {
          profesor.departamento = departamento;
        }
      }
      await this.profesorRepo.save(profesor);
    }

    const recargado = await this.profesorRepo.findOneOrFail({
      where: { id },
      relations: ["persona", "departamento"],
    });

    return this.toDTO(recargado);
  }

  async delete(id: number): Promise<boolean> {
    const persona = await this.personaRepo.findOne({ where: { id } });
    if (!persona) return false;
    await this.personaRepo.remove(persona);
    return true;
  }
}
