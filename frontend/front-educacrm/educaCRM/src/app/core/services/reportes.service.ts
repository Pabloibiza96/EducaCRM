import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface AlumnoMediaRow {
  alumnoId: number;
  nombre: string;
  apellidos: string;
  grupo: string | null;
  numCalificaciones: number;
  media: number | null;
}

export interface AlumnoResumenDTO {
  alumno: {
    id: number;
    nombre: string;
    apellidos: string;
    grupo: string | null;
  };
  mediasPorEvaluacion: {
    evaluacion: string;
    media: number;
    numCalificaciones: number;
  }[];
  mediasPorAsignatura: {
    asignaturaId: number;
    asignaturaNombre: string;
    evaluacion: string;
    media: number;
    numCalificaciones: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private baseUrl = '/api/reportes';

  constructor(private http: HttpClient) {}

  /** Medias globales por alumno */
  getAlumnosMedias(): Observable<AlumnoMediaRow[]> {
    return this.http.get<any[]>(`${this.baseUrl}/alumnos-medias`).pipe(
      map((rows) =>
        rows.map((r) => ({
          alumnoId: r.alumnoId,
          nombre: r.nombre,
          apellidos: r.apellidos,
          grupo: r.grupo ?? null,
          numCalificaciones: Number(r.numCalificaciones ?? 0),
          media:
            r.media === null || r.media === undefined
              ? null
              : Number(r.media),
        }))
      )
    );
  }

  /** Resumen detallado de un alumno */
  getResumenAlumno(id: number): Observable<AlumnoResumenDTO> {
    return this.http.get<AlumnoResumenDTO>(
      `${this.baseUrl}/alumnos/${id}/resumen`
    );
  }
}