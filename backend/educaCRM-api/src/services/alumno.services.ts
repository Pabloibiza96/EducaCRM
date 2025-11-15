import { Repository } from "typeorm";
import { AppDataSource } from "../data-source.js";
import { Alumno } from "../entities/Alumno.js";
import { Persona } from "../entities/Persona.js";
import { Grupo } from "../entities/Grupo.js";
import { Matricula } from "../entities/Matricula.js";

export interface AlumnoDTO {
  id: number;
  nia: string;
  fechaAlta: string | null;
  nombre: string;
  apellidos: string;
  email: string | null;
  grupo: string | null;
}

export interface AlumnoCreateUpdateDTO {
  nombre: string;
  apellidos: string;
  email?: string | null;
  grupo?: string | null; // nombre del grupo (opcional)
}

export class AlumnoService {
  private alumnoRepo: Repository<Alumno>;
  private personaRepo: Repository<Persona>;
  private grupoRepo: Repository<Grupo>;
  private matriculaRepo: Repository<Matricula>;

  constructor() {
    this.alumnoRepo = AppDataSource.getRepository(Alumno);
    this.personaRepo = AppDataSource.getRepository(Persona);
    this.grupoRepo = AppDataSource.getRepository(Grupo);
    this.matriculaRepo = AppDataSource.getRepository(Matricula);
  }

  private toDTO(a: Alumno): AlumnoDTO {
    const persona = a.persona;
    const grupo =
      a.matriculas && a.matriculas.length > 0
        ? a.matriculas[0].grupo?.nombre ?? null
        : null;

    return {
      id: a.id,
      nia: a.nia,
      fechaAlta: a.fechaAlta,
      nombre: persona?.nombre ?? "",
      apellidos: persona?.apellidos ?? "",
      email: persona?.email ?? null,
      grupo,
    };
  }

  async getAll(): Promise<AlumnoDTO[]> {
    const alumnos = await this.alumnoRepo.find({
      relations: ["persona", "matriculas", "matriculas.grupo"],
      order: { id: "ASC" },
    });
    return alumnos.map((a) => this.toDTO(a));
  }

  async getOne(id: number): Promise<AlumnoDTO | null> {
    const alumno = await this.alumnoRepo.findOne({
      where: { id },
      relations: ["persona", "matriculas", "matriculas.grupo"],
    });
    return alumno ? this.toDTO(alumno) : null;
  }

  /**
   * Crea:
   * 1) Persona
   * 2) Alumno (ligado a esa persona)
   * 3) (Opcional) matrícula en un grupo existente por nombre
   */
  // dentro de AlumnoService

async create(data: AlumnoCreateUpdateDTO): Promise<AlumnoDTO> {
  // 1) Crear persona
const persona = this.personaRepo.create({
  // DNI temporal corto (máx. 15 chars)
  dni: `TMP-${Date.now().toString().slice(-8)}`,
  nombre: data.nombre,
  apellidos: data.apellidos,
  email: data.email ?? null,
  telefono: null,
  direccion: null,
});
  await this.personaRepo.save(persona);

  // 2) Crear alumno (id = persona.id)
  const alumno = this.alumnoRepo.create({
    id: persona.id,
    persona,
    nia: `ALU-${String(persona.id).padStart(4, "0")}`,
    fechaAlta: new Date().toISOString().slice(0, 10),
  });
  await this.alumnoRepo.save(alumno);

  // 3) Recargar con relaciones y mapear a DTO
  const recargado = await this.alumnoRepo.findOneOrFail({
    where: { id: alumno.id },
    relations: ["persona", "matriculas", "matriculas.grupo"],
  });

  return this.toDTO(recargado);
}


  /**
   * Actualiza persona + (opcionalmente) grupo.
   * Por simplicidad, se deja una única matrícula activa.
   */
  async update(id: number, data: AlumnoCreateUpdateDTO): Promise<AlumnoDTO | null> {
    const alumno = await this.alumnoRepo.findOne({
      where: { id },
      relations: ["persona", "matriculas", "matriculas.grupo"],
    });

    if (!alumno) return null;

    // Actualizar persona
    alumno.persona.nombre = data.nombre;
    alumno.persona.apellidos = data.apellidos;
    alumno.persona.email = data.email ?? null;
    await this.personaRepo.save(alumno.persona);

    // Actualizar grupo (simple: una sola matrícula)
    if (data.grupo) {
      let grupo = await this.grupoRepo.findOne({ where: { nombre: data.grupo } });
      if (!grupo) {
        // Opcional: crear grupo si no existe, o podrías devolver error
        grupo = this.grupoRepo.create({
          nombre: data.grupo,
          curso: "",
        });
        await this.grupoRepo.save(grupo);
      }

      let matricula = alumno.matriculas?.[0];
      if (!matricula) {
        matricula = this.matriculaRepo.create({
          alumno,
          grupo,
          fecha: new Date().toISOString().slice(0, 10),
        });
      } else {
        matricula.grupo = grupo;
      }
      await this.matriculaRepo.save(matricula);
    }

    const recargado = await this.alumnoRepo.findOneOrFail({
      where: { id },
      relations: ["persona", "matriculas", "matriculas.grupo"],
    });

    return this.toDTO(recargado);
  }

  /**
   * Se elimna la persona; por las FKs con ON DELETE CASCADE
   * se borran alumno, matrículas y calificaciones asociadas.
   */
  async delete(id: number): Promise<boolean> {
    const persona = await this.personaRepo.findOne({ where: { id } });
    if (!persona) return false;
    await this.personaRepo.remove(persona);
    return true;
  }
}