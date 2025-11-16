// src/services/profesor.service.ts
import { AppDataSource } from '../data-source.js';
import { Profesor } from '../entities/Profesor.js';
import { Persona } from '../entities/Persona.js';
import { Departamento } from '../entities/Departamento.js';
import {
  ProfesorDTO,
  ProfesorCreateDTO,
  ProfesorUpdateDTO,
} from '../models/ProfesorDTO.js';
import { generateTmpDni } from '../utils/dni.js';

const profesorRepo = AppDataSource.getRepository(Profesor);
const personaRepo = AppDataSource.getRepository(Persona);
const deptRepo    = AppDataSource.getRepository(Departamento);

function toDTO(p: Profesor): ProfesorDTO {
  return {
    id: p.id,
    nombre: p.persona.nombre,
    apellidos: p.persona.apellidos,
    email: p.persona.email,
    departamento: p.departamento?.nombre ?? null,
    departamentoId: p.departamento?.id ?? null,
  };
}

export class ProfesorService {
  async getAll(): Promise<ProfesorDTO[]> {
    const list = await profesorRepo.find(); // Persona + Departamento vienen eager
    return list.map(toDTO);
  }

  async getOne(id: number): Promise<ProfesorDTO | null> {
    const p = await profesorRepo.findOne({ where: { id } });
    return p ? toDTO(p) : null;
  }

  async create(data: ProfesorCreateDTO): Promise<ProfesorDTO> {
    // 1) Persona
    const persona = personaRepo.create({
      dni: generateTmpDni(),
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
    });
    await personaRepo.save(persona);

    // 2) Departamento (opcional, por id)
    let departamento: Departamento | null = null;
    if (data.departamentoId) {
      departamento =
        (await deptRepo.findOne({ where: { id: data.departamentoId } })) ??
        null;
    }

    // 3) Profesor
    const profesor = profesorRepo.create({
      id: persona.id,
      persona,
      departamento,
      fechaAlta: new Date(),
    });

    await profesorRepo.save(profesor);
    return toDTO(profesor);
  }

  async update(id: number, data: ProfesorUpdateDTO): Promise<ProfesorDTO | null> {
    const profesor = await profesorRepo.findOne({ where: { id } });
    if (!profesor) return null;

    // Actualizar persona
    if (data.nombre !== undefined) profesor.persona.nombre = data.nombre;
    if (data.apellidos !== undefined) profesor.persona.apellidos = data.apellidos;
    if (data.email !== undefined) profesor.persona.email = data.email;
    await personaRepo.save(profesor.persona);

    // Actualizar departamento
    if (data.departamentoId !== undefined) {
      if (data.departamentoId === null) {
        profesor.departamento = null;
      } else {
        profesor.departamento =
          (await deptRepo.findOne({ where: { id: data.departamentoId } })) ??
          null;
      }
    }

    await profesorRepo.save(profesor);
    return toDTO(profesor);
  }

  async delete(id: number): Promise<boolean> {
    const profesor = await profesorRepo.findOne({ where: { id } });
    if (!profesor) return false;

    // Por la FK 1:1, borrar la persona borra el profesor
    await personaRepo.remove(profesor.persona);
    return true;
  }
}