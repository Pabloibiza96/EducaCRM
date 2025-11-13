/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '') {
    return `El campo ${fieldName} es requerido`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `El campo ${fieldName} no puede estar vacío`;
  }
  return null;
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del email no es válido';
  }
  return null;
};

/**
 * Valida que un número esté en un rango
 */
export const validateRange = (value: number, min: number, max: number, fieldName: string): string | null => {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} debe ser un número`;
  }
  if (value < min || value > max) {
    return `${fieldName} debe estar entre ${min} y ${max}`;
  }
  return null;
};

/**
 * Valida longitud de string
 */
export const validateLength = (value: string, min: number, max: number, fieldName: string): string | null => {
  if (typeof value !== 'string') {
    return `${fieldName} debe ser texto`;
  }
  const length = value.trim().length;
  if (length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres`;
  }
  if (length > max) {
    return `${fieldName} no puede exceder ${max} caracteres`;
  }
  return null;
};

/**
 * Helper para ejecutar múltiples validaciones
 */
export const runValidations = (...validations: (string | null)[]): string | null => {
  for (const validation of validations) {
    if (validation !== null) {
      return validation;
    }
  }
  return null;
};
