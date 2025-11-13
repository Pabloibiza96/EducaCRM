# Componente Modal Genérico

## Descripción
`GenericModalComponent` es un componente reutilizable de modal basado en Bootstrap 5 que utiliza **content projection** (`ng-content`) para permitir contenido personalizado en el cuerpo del modal.

## Ubicación
`src/app/shared/components/generic-modal/generic-modal.ts`

## Características
✅ Reutilizable para todos los módulos (alumnos, profesores, asignaturas, grupos, etc.)  
✅ Personalizable (título, botones, colores, tamaño)  
✅ Proyección de contenido con `ng-content`  
✅ Integración nativa con Bootstrap 5  
✅ Gestión automática del modal (abrir/cerrar)  

## Inputs (Parámetros)

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `title` | `string` | `'Modal'` | Título del modal |
| `confirmText` | `string` | `'Guardar'` | Texto del botón de confirmación |
| `cancelText` | `string` | `'Cancelar'` | Texto del botón de cancelar |
| `modalSize` | `string` | `''` | Tamaño del modal: `''`, `'modal-sm'`, `'modal-lg'`, `'modal-xl'` |
| `headerClass` | `string` | `'bg-primary text-white'` | Clases CSS para el header |
| `confirmBtnClass` | `string` | `'btn-primary'` | Clase del botón de confirmación |

## Outputs (Eventos)

| Output | Tipo | Descripción |
|--------|------|-------------|
| `confirm` | `void` | Se emite cuando se hace clic en el botón de confirmación |
| `cancel` | `void` | Se emite cuando se cierra el modal |

## Métodos públicos

| Método | Descripción |
|--------|-------------|
| `open()` | Abre el modal |
| `close()` | Cierra el modal |

## Uso básico

### 1. Importar el componente

```typescript
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, GenericModalComponent],
  // ...
})
export class MiComponente {
  @ViewChild('miModal') miModal!: GenericModalComponent;
}
```

### 2. Usar en el template

```html
<app-generic-modal 
  #miModal
  [title]="'Mi Modal'"
  [confirmText]="'Guardar'"
  (confirm)="guardar()">
  
  <!-- Tu contenido aquí -->
  <form>
    <div class="mb-3">
      <label class="form-label">Nombre</label>
      <input class="form-control" [(ngModel)]="nombre" name="nombre" />
    </div>
  </form>
  
</app-generic-modal>
```

### 3. Abrir y cerrar desde el código

```typescript
// Abrir el modal
abrirModal() {
  this.miModal.open();
}

// Cerrar el modal
guardar() {
  // ... tu lógica
  this.miModal.close();
}
```

## Ejemplos de uso por módulo

### Alumnos (simple)
```html
<app-generic-modal 
  #modalAlumno
  [title]="modoEdicion ? 'Editar alumno' : 'Nuevo alumno'"
  [confirmText]="modoEdicion ? 'Guardar cambios' : 'Añadir alumno'"
  (confirm)="guardar()">
  
  <form>
    <div class="mb-3">
      <label class="form-label">Nombre</label>
      <input class="form-control" [(ngModel)]="alumno.nombre" name="nombre" />
    </div>
    <!-- más campos... -->
  </form>
  
</app-generic-modal>
```

### Profesores (grande con color personalizado)
```html
<app-generic-modal 
  #modalProfesor
  [title]="'Nuevo profesor'"
  modalSize="modal-lg"
  headerClass="bg-info text-white"
  confirmBtnClass="btn-info"
  (confirm)="guardar()">
  
  <form>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Nombre</label>
        <input class="form-control" [(ngModel)]="profesor.nombre" name="nombre" />
      </div>
      <!-- más campos... -->
    </div>
  </form>
  
</app-generic-modal>
```

### Asignaturas (con color success)
```html
<app-generic-modal 
  #modalAsignatura
  [title]="'Nueva asignatura'"
  headerClass="bg-success text-white"
  confirmBtnClass="btn-success"
  (confirm)="guardar()">
  
  <!-- contenido del formulario -->
  
</app-generic-modal>
```

## Ventajas

1. **Un solo componente para todo**: No necesitas crear múltiples modales
2. **Fácil mantenimiento**: Cambios en un solo lugar
3. **Consistencia**: Misma apariencia en toda la aplicación
4. **Personalizable**: Colores, tamaños, textos configurables
5. **Limpio**: Proyección de contenido mantiene el código organizado

## Colores disponibles

### Header Classes
- `bg-primary text-white` (azul - default)
- `bg-success text-white` (verde)
- `bg-info text-white` (cyan)
- `bg-warning text-dark` (amarillo)
- `bg-danger text-white` (rojo)
- `bg-dark text-white` (oscuro)

### Button Classes
- `btn-primary` (default)
- `btn-success`
- `btn-info`
- `btn-warning`
- `btn-danger`
- `btn-secondary`

## Tamaños del modal

- Sin valor: Modal normal (default)
- `modal-sm`: Modal pequeño
- `modal-lg`: Modal grande
- `modal-xl`: Modal extra grande

## Notas importantes

1. **Bootstrap**: Requiere Bootstrap 5 y su JavaScript cargado en `angular.json`
2. **ViewChild**: Usa `@ViewChild` para obtener referencia al modal
3. **AfterViewInit**: El modal se inicializa después de que la vista se carga
4. **Form submit**: Si usas `<form (ngSubmit)="...">`, el evento `confirm` también se dispara
