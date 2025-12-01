export interface CalificacionDTO {
  id: number;
  alumnoId: number;
  asignaturaId: number;
  alumnoNombre: string;
  asignaturaNombre: string;
  evaluacion: string;
  nota: number | null;
  fecha: string | null;
}

export interface CalificacionPayload {
  alumnoId: number;
  asignaturaId: number;
  evaluacion: string;
  nota: number | null;
  fecha: string | null;
}
