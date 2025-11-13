import { Directive, OnInit, ViewChild } from '@angular/core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { GenericModalComponent } from '../generic-modal/generic-modal';

/**
 * Componente base abstracto para listas CRUD genéricas.
 * 
 * Proporciona funcionalidad común para todos los componentes de lista CRUD:
 * - Gestión de modales (abrir/cerrar)
 * - Operaciones CRUD (crear, editar, eliminar)
 * - Búsqueda y filtrado
 * - Modo edición vs creación
 * 
 * @template T - El tipo de entidad que maneja el componente (Alumno, Profesor, etc.)
 * 
 * @example
 * ```typescript
 * export class AlumnosListComponent extends BaseCrudListComponent<Alumno> {
 *   @ViewChild('modalAlumno') override modal!: GenericModalComponent;
 * 
 *   constructor(public alumnosSrv: AlumnosService) {
 *     super(alumnosSrv, { id: 0, nombre: '', apellidos: '', email: '', grupo: '' });
 *   }
 * 
 *   protected override getSearchFields(item: Alumno): string[] {
 *     return [item.nombre, item.apellidos, item.email, item.grupo];
 *   }
 * }
 * ```
 */
@Directive()
export abstract class BaseCrudListComponent<T extends { id: number }> implements OnInit {
  /**
   * Referencia al modal genérico.
   * Debe ser declarado en cada componente hijo con @ViewChild.
   */
  protected abstract get modal(): GenericModalComponent;

  /**
   * Query de búsqueda del usuario.
   * Se utiliza en el método filtrados() para filtrar la lista.
   */
  q = '';

  /**
   * Indica si estamos editando una entidad existente (true) o creando una nueva (false).
   */
  modoEdicion = false;

  /**
   * Entidad actual que se está editando o creando en el modal.
   */
  actual: T;

  /**
   * Plantilla vacía para crear nuevas entidades.
   * Se clona en abrirModal() al crear una nueva entidad.
   */
  protected emptyEntity: T;

  /**
   * @param service - El servicio CRUD que gestiona las entidades de tipo T
   * @param emptyEntity - Un objeto plantilla que representa una entidad vacía (para crear nuevas)
   */
  constructor(
    protected service: BaseCrudService<T>,
    emptyEntity: T
  ) {
    this.emptyEntity = emptyEntity;
    this.actual = { ...emptyEntity };
  }

  /**
   * Inicializa el componente.
   * Las clases hijas deben sobrescribir este método para cargar datos iniciales.
   */
  ngOnInit(): void {
    // Las clases hijas deben implementar la carga de datos
  }

  /**
   * Devuelve la lista filtrada de entidades basándose en la query de búsqueda.
   * 
   * Llama a getSearchFields() para obtener los campos en los que buscar.
   * Las clases hijas deben implementar getSearchFields().
   * 
   * @returns Array de entidades filtradas
   */
  filtrados(): T[] {
    const t = this.q.trim().toLowerCase();
    if (!t) return this.service.items();
    
    return this.service.items().filter(item => {
      const fields = this.getSearchFields(item);
      return fields.some(field => 
        (field || '').toLowerCase().includes(t)
      );
    });
  }

  /**
   * Método abstracto que debe ser implementado por las clases hijas.
   * 
   * Define qué campos de la entidad se utilizarán para la búsqueda.
   * 
   * @param item - La entidad sobre la que extraer los campos de búsqueda
   * @returns Array de strings que representan los valores de los campos a buscar
   * 
   * @example
   * ```typescript
   * protected override getSearchFields(alumno: Alumno): string[] {
   *   return [alumno.nombre, alumno.apellidos, alumno.email, alumno.grupo];
   * }
   * ```
   */
  protected abstract getSearchFields(item: T): string[];

  /**
   * Abre el modal para crear o editar una entidad.
   * 
   * @param nuevo - true para crear nueva entidad, false para editar existente
   * @param item - La entidad a editar (opcional, solo si nuevo = false)
   */
  abrirModal(nuevo = true, item?: T): void {
    this.modoEdicion = !nuevo;
    this.actual = nuevo
      ? { ...this.emptyEntity }
      : { ...item! };
    this.modal.open();
  }

  /**
   * Alias de abrirModal(false, item) para mejor legibilidad.
   * 
   * @param item - La entidad a editar
   */
  editar(item: T): void {
    this.abrirModal(false, item);
  }

  /**
   * Guarda la entidad actual (crea o actualiza según modoEdicion).
   * 
   * Llama al servicio correspondiente y cierra el modal.
   * Resetea la entidad actual a vacía tras guardar.
   */
  guardar(): void {
    if (this.modoEdicion) {
      this.service.update(this.actual.id, this.actual);
    } else {
      this.service.add({ ...this.actual });
    }
    this.modal.close();
    this.actual = { ...this.emptyEntity };
  }

  /**
   * Elimina una entidad tras confirmación del usuario.
   * 
   * @param id - El ID de la entidad a eliminar
   */
  eliminar(id: number): void {
    if (confirm(this.getDeleteConfirmMessage())) {
      this.service.delete(id);
    }
  }

  /**
   * Devuelve el mensaje de confirmación para eliminar.
   * 
   * Las clases hijas pueden sobrescribir este método para personalizar el mensaje.
   * 
   * @returns El mensaje de confirmación
   */
  protected getDeleteConfirmMessage(): string {
    return '¿Está seguro de que desea eliminar este elemento?';
  }
}
