# FASE 3 COMPLETADA: CrudTableComponent<T> - Reutilización de HTML de Tablas

## Resumen
Se ha creado un componente genérico `CrudTableComponent<T>` para eliminar la duplicación de HTML en las tablas de todos los módulos CRUD. Este componente permite configurar columnas de forma declarativa con soporte para formatters, valueGetters, templates personalizados y botones de acción.

## Componente Creado

### CrudTableComponent<T>
**Archivo**: `src/app/shared/components/crud-table/crud-table.component.ts` (~200 líneas)

**Características**:
- Configuración declarativa de columnas mediante `TableColumn<T>[]`
- Soporte para valores simples (`key`), transformados (`valueGetter`), formateados (`formatter`)
- Templates personalizados para columnas complejas (`template: TemplateRef<any>`)
- Estilos dinámicos por celda (`cellClass`)
- Botones de acción configurables (`ActionButton<T>[]`)
- Estado vacío personalizable
- Totalmente tipado con TypeScript genéricos

**Interfaces**:
```typescript
interface TableColumn<T> {
  key?: string;
  header: string;
  valueGetter?: (row: T) => any;
  formatter?: (value: any, row: T) => string;
  template?: TemplateRef<any>;
  cellClass?: string | ((row: T) => string);
  headerClass?: string;
  hidden?: boolean;
  width?: string;
}

interface ActionButton<T> {
  icon?: string;
  label?: string;
  btnClass: string;
  onClick: (row: T) => void;
  tooltip?: string;
  hidden?: (row: T) => boolean;
}
```

## Componentes Migrados (6/6 = 100%)

### 1. AlumnosListComponent ✅
- **Columnas**: 5 simples (id, nombre, apellidos, email, grupo)
- **Acciones**: 2 con iconos (editar, eliminar)
- **Reducción**: ~25 líneas HTML
- **Características**: Configuración básica con keys directas

### 2. ProfesoresListComponent ✅
- **Columnas**: 4 (id, nombre completo, especialidad, email)
- **Acciones**: 2 con labels textuales ("Editar", "Eliminar")
- **Reducción**: ~30 líneas HTML
- **Características**: `valueGetter` para combinar nombre + apellidos

### 3. AsignaturasListComponent ✅
- **Columnas**: 5 (id, nombre, código, curso, profesor)
- **Acciones**: 2 con labels
- **Reducción**: ~28 líneas HTML
- **Características**: `formatter` para campo opcional profesor (`val || '—'`)

### 4. GruposListComponent ✅
- **Columnas**: 5 (id, nombre, turno, aula, numAlumnos)
- **Acciones**: 2 con labels
- **Reducción**: ~27 líneas HTML
- **Características**: `cellClass: 'text-center'` para columna numérica

### 5. AdminUsersComponent ✅
- **Columnas**: 6 (id, username, nombre, email, rol badge, activo badge)
- **Acciones**: 3 (editar, toggle activo con icono power, eliminar)
- **Reducción**: ~35 líneas HTML
- **Características Avanzadas**:
  - Templates personalizados para badges de rol (5 colores dinámicos)
  - Template para badge activo/inactivo
  - Método helper `getRolBadgeClass()` para clases Bootstrap
  - Acción especial de toggle con icono `bi-power`

### 6. CalificacionesListComponent ✅
- **Columnas**: 4 (alumnoNombre, asignaturaNombre, evaluación badge, nota coloreada)
- **Acciones**: 2 con iconos (editar, eliminar)
- **Reducción**: ~32 líneas HTML
- **Características Avanzadas**:
  - Template para badge de evaluación (4 colores: 1ª, 2ª, 3ª, Extraordinaria)
  - Template para nota con color condicional (verde ≥5, rojo <5)
  - Usa `view()` computed signal en lugar de `filtrados()`
  - Método helper `getEvaluacionBadgeClass()` para clases dinámicas

## Ejemplos de Uso

### Columnas Simples (key directo)
```typescript
columns: TableColumn<Alumno>[] = [
  { key: 'id', header: 'ID', width: '80px' },
  { key: 'nombre', header: 'Nombre' },
  { key: 'email', header: 'Email' }
];
```

### Columnas con valueGetter (transformación)
```typescript
columns: TableColumn<Profesor>[] = [
  { 
    header: 'Nombre Completo',
    valueGetter: (p) => `${p.nombre} ${p.apellidos}`
  }
];
```

### Columnas con formatter (formateo)
```typescript
columns: TableColumn<Asignatura>[] = [
  { 
    key: 'profesor',
    header: 'Profesor',
    formatter: (val) => val || '—'  // Manejo de opcionales
  }
];
```

### Columnas con template (badges personalizados)
```typescript
// En TypeScript:
@ViewChild('rolBadgeTpl', { static: true }) rolBadgeTpl!: TemplateRef<any>;

columns: TableColumn<Usuario>[] = [
  {
    key: 'rol',
    header: 'Rol',
    template: this.rolBadgeTpl
  }
];

// En HTML:
<ng-template #rolBadgeTpl let-row>
  <span class="badge" [ngClass]="getRolBadgeClass(row.rol)">
    {{ row.rol }}
  </span>
</ng-template>
```

### Acciones con iconos vs labels
```typescript
// Con icono Bootstrap:
actions: ActionButton<Alumno>[] = [
  {
    icon: 'pencil',
    btnClass: 'btn-sm btn-outline-primary',
    onClick: (a) => this.editar(a)
  }
];

// Con label textual:
actions: ActionButton<Profesor>[] = [
  {
    label: 'Editar',
    btnClass: 'btn-sm btn-outline-primary',
    onClick: (p) => this.editar(p)
  }
];
```

## Reducción de Código

### HTML Eliminado por Componente
- AlumnosListComponent: ~25 líneas
- ProfesoresListComponent: ~30 líneas
- AsignaturasListComponent: ~28 líneas
- GruposListComponent: ~27 líneas
- AdminUsersComponent: ~35 líneas
- CalificacionesListComponent: ~32 líneas

**TOTAL HTML ELIMINADO: ~177 líneas**

Cada tabla antigua de ~25-35 líneas se reemplaza por:
```html
<app-crud-table
  [data]="filtrados()"
  [columns]="columns"
  [actions]="actions"
/>
```

### TypeScript Añadido
- CrudTableComponent: ~200 líneas (componente reutilizable)
- Configuraciones por componente: ~30-50 líneas cada uno
- **Resultado neto**: Menos código duplicado, mayor mantenibilidad

## Ventajas Obtenidas

### 1. Mantenibilidad
- Cambios en estructura de tabla se hacen en 1 solo lugar
- Estilos Bootstrap centralizados
- Menos superficie de bugs

### 2. Consistencia
- Todas las tablas tienen la misma apariencia
- Comportamiento uniforme de acciones
- Estados vacíos consistentes

### 3. Flexibilidad
- Soporte para columnas simples y complejas
- Templates personalizados cuando se necesitan
- Formatters y valueGetters para transformaciones

### 4. Type Safety
- Generics en TypeScript preservan tipos
- Intellisense completo en IDE
- Errores detectados en compilación

## Comparación con Fase 2

| Métrica | Fase 2 (TypeScript) | Fase 3 (HTML) |
|---------|---------------------|---------------|
| Objetivo | Lógica CRUD duplicada | HTML tabla duplicado |
| Solución | BaseCrudListComponent<T> | CrudTableComponent<T> |
| Componentes | 6/6 migrados | 6/6 migrados |
| Líneas Eliminadas | ~121 líneas TS | ~177 líneas HTML |
| Componente Base | ~180 líneas | ~200 líneas |
| Bundle Size | 728.61 KB → 728.73 KB (+120 bytes) | 728.73 KB → 732.03 KB (+3.3 KB) |

## Decisiones de Diseño

### Templates vs Formatters
- **Formatters**: Para transformaciones simples de texto (null handling, decimales)
- **Templates**: Para HTML complejo (badges, ngClass dinámico, pipes)

### ViewChild static: true
Los templates se declaran con `{ static: true }` porque:
- Se necesitan en `ngOnInit()` para inicializar columnas
- No están dentro de `*ngIf` o `@if`
- Evita errores de template undefined

### Separación de Concerns
- `CrudTableComponent`: Presentación de tabla genérica
- `BaseCrudListComponent`: Lógica CRUD (create, read, update, delete)
- Componentes hijos: Configuración específica de dominio

## Estado de Compilación

✅ **Compilación exitosa**: 0 errores, 0 warnings
📦 **Bundle Size**: 732.03 KB (inicial) / 147.34 KB (transfer)
📈 **Incremento vs Fase 2**: +3.3 KB (~0.45%)

## Próximos Pasos Sugeridos

### Posibles Mejoras Futuras:
1. **Paginación**: Añadir soporte para tablas grandes
2. **Ordenamiento**: Click en header para ordenar columnas
3. **Selección múltiple**: Checkboxes para acciones en lote
4. **Exportación**: Botón para exportar a CSV/Excel
5. **Columnas redimensionables**: Drag & drop para ajustar anchos
6. **Responsive**: Tabla colapsable en móviles

### Fase 4 (Opcional):
- Crear `GenericSearchBarComponent` para eliminar duplicación de inputs de búsqueda
- Unificar estilos de botones "Nuevo" en todos los módulos
- Crear guards de navegación para formularios sin guardar

## Conclusión

La Fase 3 completa la refactorización HTML comenzada en Fase 1 (modales) y Fase 2 (lógica TypeScript). Ahora el proyecto tiene:
- ✅ Modales reutilizables (GenericModalComponent)
- ✅ Lógica CRUD centralizada (BaseCrudListComponent<T>)
- ✅ Tablas reutilizables (CrudTableComponent<T>)

**Resultado**: Código más limpio, mantenible y escalable con mínimo impacto en bundle size.

---

**Fecha de completación**: 2024
**Compilación**: ✅ Exitosa (732.03 KB)
**Componentes migrados**: 6/6 (100%)
**Líneas HTML eliminadas**: ~177
