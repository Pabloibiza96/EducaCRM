import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Configuración de una columna de tabla.
 * 
 * @template T - El tipo de datos de las filas
 */
export interface TableColumn<T = any> {
  /** Clave de la propiedad en el objeto de datos */
  key?: string;
  
  /** Título visible en el header de la columna */
  header: string;
  
  /** Función para obtener el valor a mostrar */
  valueGetter?: (row: T) => any;
  
  /** Función para formatear el valor (ej: pipes personalizados) */
  formatter?: (value: any, row: T) => string;
  
  /** Template personalizado para la celda */
  template?: TemplateRef<any>;
  
  /** Clases CSS para la celda */
  cellClass?: string | ((row: T) => string);
  
  /** Clases CSS para el header */
  headerClass?: string;
  
  /** Si es true, oculta la columna */
  hidden?: boolean;
  
  /** Ancho de la columna (CSS) */
  width?: string;
}

/**
 * Configuración de botones de acción.
 */
export interface ActionButton<T = any> {
  /** Icono de Bootstrap*/
  icon?: string;
  
  /** Texto del botón */
  label?: string;
  
  /** Clases CSS del botón */
  btnClass: string;
  
  /** Callback al hacer clic */
  onClick: (row: T) => void;
  
  /** Tooltip del botón */
  tooltip?: string;
  
  /** Función para ocultar el botón según la fila */
  hidden?: (row: T) => boolean;
}

/**
 * Componente genérico de tabla CRUD reutilizable.
 * 
 * Soporta:
 * - Configuración declarativa de columnas
 * - Formatters personalizados
 * - Templates personalizados para celdas complejas
 * - Botones de acción configurables
 * - Empty state customizable
 * - Estilos Bootstrap 5
 * 
 * @example
 * ```html
 * <app-crud-table
 *   [data]="filtrados()"
 *   [columns]="columns"
 *   [actions]="actions"
 *   emptyMessage="No hay registros">
 * </app-crud-table>
 * ```
 * 
 * @example
 * ```typescript
 * columns: TableColumn<Alumno>[] = [
 *   { key: 'id', header: 'ID' },
 *   { key: 'nombre', header: 'Nombre' },
 *   { 
 *     header: 'Email', 
 *     valueGetter: (row) => row.email,
 *     cellClass: 'text-primary' 
 *   }
 * ];
 * 
 * actions: ActionButton<Alumno>[] = [
 *   { icon: 'pencil', btnClass: 'btn-sm btn-outline-primary', onClick: (row) => this.editar(row) },
 *   { icon: 'trash', btnClass: 'btn-sm btn-outline-danger', onClick: (row) => this.eliminar(row.id) }
 * ];
 * ```
 */
@Component({
  selector: 'app-crud-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-responsive shadow-sm rounded">
      <table class="table table-striped align-middle mb-0 table-hover">
        <thead class="table-light">
          <tr>
            @for (col of visibleColumns; track col.header) {
              <th [class]="col.headerClass || ''" [style.width]="col.width">
                {{ col.header }}
              </th>
            }
            @if (actions && actions.length > 0) {
              <th class="text-end" [style.width]="actionsWidth || 'auto'">Acciones</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data; track trackBy($index, row)) {
            <tr>
              @for (col of visibleColumns; track col.header) {
                <td [class]="getCellClass(col, row)">
                  @if (col.template) {
                    <ng-container *ngTemplateOutlet="col.template; context: { $implicit: row, value: getValue(col, row) }"></ng-container>
                  } @else {
                    {{ getFormattedValue(col, row) }}
                  }
                </td>
              }
              @if (actions && actions.length > 0) {
                <td class="text-end">
                  @for (action of getVisibleActions(row); track action.icon || action.label) {
                    <button 
                      [class]="'btn ' + action.btnClass + ' me-2'"
                      (click)="action.onClick(row)"
                      [title]="action.tooltip || ''">
                      @if (action.icon) {
                        <i [class]="'bi bi-' + action.icon"></i>
                      }
                      @if (action.label) {
                        {{ action.label }}
                      }
                    </button>
                  }
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="totalColumns" class="text-center text-muted py-3">
                {{ emptyMessage || 'No hay registros' }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-hover tbody tr:hover {
      cursor: pointer;
    }
  `]
})
export class CrudTableComponent<T = any> {
  /** Array de datos a mostrar en la tabla */
  @Input() data: T[] = [];
  
  /** Configuración de las columnas */
  @Input() columns: TableColumn<T>[] = [];
  
  /** Configuración de los botones de acción */
  @Input() actions?: ActionButton<T>[];
  
  /** Mensaje cuando no hay datos */
  @Input() emptyMessage?: string;
  
  /** Función para trackBy en el @for */
  @Input() trackBy: (index: number, item: T) => any = (index, item: any) => item.id ?? index;
  
  /** Ancho de la columna de acciones */
  @Input() actionsWidth?: string;

  /**
   * Columnas visibles (filtra las ocultas).
   */
  get visibleColumns(): TableColumn<T>[] {
    return this.columns.filter(col => !col.hidden);
  }

  /**
   * Total de columnas (incluyendo acciones).
   */
  get totalColumns(): number {
    return this.visibleColumns.length + (this.actions && this.actions.length > 0 ? 1 : 0);
  }

  /**
   * Obtiene el valor de una celda según la configuración de la columna.
   */
  getValue(col: TableColumn<T>, row: T): any {
    if (col.valueGetter) {
      return col.valueGetter(row);
    }
    if (col.key) {
      return (row as any)[col.key];
    }
    return '';
  }

  /**
   * Obtiene el valor formateado de una celda.
   */
  getFormattedValue(col: TableColumn<T>, row: T): string {
    const value = this.getValue(col, row);
    if (col.formatter) {
      return col.formatter(value, row);
    }
    return value ?? '—';
  }

  /**
   * Obtiene las clases CSS de una celda.
   */
  getCellClass(col: TableColumn<T>, row: T): string {
    if (typeof col.cellClass === 'function') {
      return col.cellClass(row);
    }
    return col.cellClass || '';
  }

  /**
   * Filtra las acciones visibles para una fila.
   */
  getVisibleActions(row: T): ActionButton<T>[] {
    if (!this.actions) return [];
    return this.actions.filter(action => !action.hidden || !action.hidden(row));
  }
}
