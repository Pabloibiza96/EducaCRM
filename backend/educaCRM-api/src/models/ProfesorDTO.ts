export interface ProfesorDTO {
  id: number;
  nombre: string;
  apellidos: string;
  email: string | null;
  departamento: string | null;
  departamentoId: number | null;
}

export interface ProfesorCreateDTO {
  nombre: string;
  apellidos: string;
  email: string | null;
  departamentoId: number | null;
}

export interface ProfesorUpdateDTO {
  nombre?: string;
  apellidos?: string;
  email?: string | null;
  departamentoId?: number | null;
}
