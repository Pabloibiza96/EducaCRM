export interface AlumnoMediaDTO {
  alumnoId: number;
  nombre: string;
  apellidos: string;
  grupo: string | null;
  media: number | null;
  numCalificaciones: number;
}
