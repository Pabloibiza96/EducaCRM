# Sistema de Permisos y Roles - EducaCRM

## Resumen
Se ha implementado un sistema completo de autorización basado en roles (RBAC - Role-Based Access Control) para controlar el acceso a módulos y funcionalidades según el rol del usuario autenticado.

## Componentes Implementados

### 1. RoleService
**Archivo**: `src/app/core/auth/role.service.ts`

Servicio centralizado para gestión de permisos. Proporciona métodos para:
- Verificar permisos específicos
- Verificar roles
- Comprobar acceso a módulos (create, edit, delete)

**Permisos disponibles** (tipo `Permission`):
- `view_*` - Ver listado del módulo
- `create_*` - Crear nuevos registros
- `edit_*` - Editar registros existentes
- `delete_*` - Eliminar registros
- `view_dashboard` - Acceso al dashboard
- `view_reports` - Acceso a informes

Donde `*` puede ser: `alumnos`, `profesores`, `asignaturas`, `grupos`, `calificaciones`, `usuarios`

### 2. Directivas Estructurales
**Archivo**: `src/app/core/auth/has-role.directive.ts`

#### `*hasRole`
Muestra/oculta elementos según el rol del usuario.

```html
<!-- Rol único -->
<button *hasRole="'administrador'">Solo admins</button>

<!-- Múltiples roles -->
<button *hasRole="['administrador', 'direccion']">Admins o Dirección</button>
```

#### `*hasPermission`
Muestra/oculta elementos según permisos específicos.

```html
<!-- Permiso único -->
<button *hasPermission="'create_alumnos'">Crear alumno</button>

<!-- Múltiples permisos (al menos uno) -->
<button *hasPermission="['edit_alumnos', 'delete_alumnos']">Editar o eliminar</button>
```

### 3. Guards de Rutas
**Archivo**: `src/app/core/auth/role.guard.ts`

#### `roleGuard`
Protege rutas basándose en roles requeridos.

```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [roleGuard],
  data: { roles: ['administrador', 'direccion'] }
}
```

#### `permissionGuard`
Protege rutas basándose en permisos específicos.

```typescript
{
  path: 'alumnos/nuevo',
  component: AlumnoFormComponent,
  canActivate: [permissionGuard],
  data: { permissions: ['create_alumnos'] }
}
```

## Matriz de Permisos por Rol

### Administrador
**Acceso**: Total a todos los módulos y configuraciones

| Módulo | Ver | Crear | Editar | Eliminar |
|--------|-----|-------|--------|----------|
| Alumnos | ✅ | ✅ | ✅ | ✅ |
| Profesores | ✅ | ✅ | ✅ | ✅ |
| Asignaturas | ✅ | ✅ | ✅ | ✅ |
| Grupos | ✅ | ✅ | ✅ | ✅ |
| Calificaciones | ✅ | ✅ | ✅ | ✅ |
| Usuarios | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | - | - | - |
| Informes | ✅ | - | - | - |

### Dirección
**Acceso**: Gestión de personal, informes y supervisión global

| Módulo | Ver | Crear | Editar | Eliminar |
|--------|-----|-------|--------|----------|
| Alumnos | ✅ | ❌ | ❌ | ❌ |
| Profesores | ✅ | ❌ | ❌ | ❌ |
| Asignaturas | ✅ | ❌ | ❌ | ❌ |
| Grupos | ✅ | ❌ | ❌ | ❌ |
| Calificaciones | ✅ | ❌ | ❌ | ❌ |
| Usuarios | ✅ | ✅ | ✅ | ❌ |
| Dashboard | ✅ | - | - | - |
| Informes | ✅ | - | - | - |

### Jefatura de Estudios
**Acceso**: Gestión académica completa (alumnos, profesores, asignaturas, grupos)

| Módulo | Ver | Crear | Editar | Eliminar |
|--------|-----|-------|--------|----------|
| Alumnos | ✅ | ✅ | ✅ | ✅ |
| Profesores | ✅ | ✅ | ✅ | ✅ |
| Asignaturas | ✅ | ✅ | ✅ | ✅ |
| Grupos | ✅ | ✅ | ✅ | ✅ |
| Calificaciones | ✅ | ❌ | ❌ | ❌ |
| Usuarios | ❌ | ❌ | ❌ | ❌ |
| Dashboard | ✅ | - | - | - |

### Profesor
**Acceso**: Gestión de notas y grupos asignados

| Módulo | Ver | Crear | Editar | Eliminar |
|--------|-----|-------|--------|----------|
| Alumnos | ✅ | ❌ | ❌ | ❌ |
| Profesores | ❌ | ❌ | ❌ | ❌ |
| Asignaturas | ❌ | ❌ | ❌ | ❌ |
| Grupos | ✅ | ❌ | ❌ | ❌ |
| Calificaciones | ✅ | ✅ | ✅ | ❌ |
| Usuarios | ❌ | ❌ | ❌ | ❌ |
| Dashboard | ✅ | - | - | - |

### Alumno
**Acceso**: Solo consulta de sus propias calificaciones e información personal

| Módulo | Ver | Crear | Editar | Eliminar |
|--------|-----|-------|--------|----------|
| Alumnos | ❌ | ❌ | ❌ | ❌ |
| Profesores | ❌ | ❌ | ❌ | ❌ |
| Asignaturas | ❌ | ❌ | ❌ | ❌ |
| Grupos | ❌ | ❌ | ❌ | ❌ |
| Calificaciones | ✅* | ❌ | ❌ | ❌ |
| Usuarios | ❌ | ❌ | ❌ | ❌ |

*Solo sus propias calificaciones (requiere filtrado adicional en componente)

## Rutas Protegidas

### Configuración en `app.routes.ts`

```typescript
{
  path: 'alumnos',
  loadComponent: () => import('./pages/alumnos/alumnos-list/alumnos-list').then(m => m.AlumnosListComponent),
  title: 'Alumnos | EducaCRM',
  canActivate: [roleGuard], 
  data: { roles: ['administrador', 'direccion', 'jefatura', 'profesor'] }
},
{
  path: 'profesores',
  loadComponent: () => import('./pages/profesores/profesores-list/profesores-list').then(m => m.ProfesoresListComponent),
  title: 'Profesores | EducaCRM',
  canActivate: [roleGuard], 
  data: { roles: ['administrador', 'direccion', 'jefatura'] }
},
{
  path: 'grupos',
  loadComponent: () => import('./pages/grupos/grupos-list/grupos-list').then(m => m.GruposListComponent),
  title: 'Grupos | EducaCRM',
  canActivate: [roleGuard], 
  data: { roles: ['administrador', 'direccion', 'jefatura', 'profesor'] }
},
{
  path: 'asignaturas',
  loadComponent: () => import('./pages/asignaturas/asignaturas-list/asignaturas-list').then(m => m.AsignaturasListComponent),
  title: 'Asignaturas | EducaCRM',
  canActivate: [roleGuard], 
  data: { roles: ['administrador', 'direccion', 'jefatura'] }
},
{
  path: 'calificaciones',
  loadComponent: () => import('./pages/calificaciones/calificaciones-list/calificaciones-list').then(m => m.CalificacionesListComponent),
  title: 'Calificaciones | EducaCRM',
  canActivate: [roleGuard], 
  data: { roles: ['administrador', 'direccion', 'jefatura', 'profesor', 'alumno'] }
},
{
  path: 'admin',
  loadComponent: () => import('./pages/admin/admin-users/admin-users').then(m => m.AdminUsersComponent),
  title: 'Admin | EducaCRM',
  canActivate: [roleGuard], 
  data: { roles: ['administrador', 'direccion'] }
}
```

## Implementación en Componentes

### Ejemplo: AlumnosListComponent

#### TypeScript
```typescript
import { RoleService } from '../../../core/auth/role.service';
import { HasPermissionDirective } from '../../../core/auth/has-role.directive';

@Component({
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent, HasPermissionDirective],
  // ...
})
export class AlumnosListComponent extends BaseCrudListComponent<Alumno> {
  
  // Configuración de acciones con permisos
  actions: ActionButton<Alumno>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar',
      onClick: (alumno) => this.abrirModal(false, alumno),
      hidden: () => !this.roleService.canEdit('alumnos')  // Ocultar si no tiene permiso
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar',
      onClick: (alumno) => this.eliminar(alumno.id),
      hidden: () => !this.roleService.canDelete('alumnos')  // Ocultar si no tiene permiso
    }
  ];

  constructor(
    public alumnosSrv: AlumnosService,
    public roleService: RoleService  // Inyectar RoleService
  ) {
    super(alumnosSrv, { id: 0, nombre: '', apellidos: '', email: '', grupo: '' });
  }
}
```

#### HTML
```html
<!-- Botón "Nuevo" solo visible con permiso de creación -->
<button class="btn btn-success" (click)="abrirModal(true)" *hasPermission="'create_alumnos'">
  <i class="bi bi-plus-lg"></i> Nuevo alumno
</button>

<!-- Tabla con botones de acción que se ocultan automáticamente según permisos -->
<app-crud-table
  [data]="filtrados()"
  [columns]="columns"
  [actions]="actions">
</app-crud-table>
```

## Uso del RoleService

### Métodos Principales

```typescript
// Inyectar en constructor
constructor(private roleService: RoleService) {}

// Verificar permiso específico
if (this.roleService.hasPermission('create_alumnos')) {
  // Permitir crear alumno
}

// Verificar si tiene alguno de varios permisos
if (this.roleService.hasAnyPermission('edit_alumnos', 'delete_alumnos')) {
  // Permitir editar o eliminar
}

// Verificar si tiene todos los permisos
if (this.roleService.hasAllPermissions('view_alumnos', 'edit_alumnos')) {
  // Permitir solo si tiene ambos
}

// Verificar rol
if (this.roleService.hasRole('administrador', 'jefatura')) {
  // Usuario es admin o jefatura
}

// Métodos de conveniencia
if (this.roleService.isAdmin()) { /* ... */ }
if (this.roleService.isProfesor()) { /* ... */ }
if (this.roleService.isAlumno()) { /* ... */ }

// Verificar acceso a módulo
if (this.roleService.canAccessModule('alumnos')) { /* ... */ }
if (this.roleService.canCreate('alumnos')) { /* ... */ }
if (this.roleService.canEdit('alumnos')) { /* ... */ }
if (this.roleService.canDelete('alumnos')) { /* ... */ }

// Obtener todos los permisos del usuario
const permissions = this.roleService.getUserPermissions();
```

## Próximos Pasos

### Implementación Pendiente

1. **Filtrado de calificaciones para alumnos**: 
   - En `CalificacionesListComponent`, filtrar para que el alumno solo vea sus propias calificaciones
   - Usar `authService.currentUser().id` para filtrar por `alumnoId`

2. **Aplicar permisos en resto de componentes**:
   - ProfesoresListComponent
   - AsignaturasListComponent
   - GruposListComponent
   - CalificacionesListComponent
   - AdminUsersComponent

3. **Navbar condicional**:
   - Ocultar enlaces del menú según permisos del usuario
   - Usar `*hasPermission` o `*hasRole` en links de navegación

4. **Mensajes de error personalizados**:
   - Mostrar página 403 "Acceso denegado" cuando se bloquee el acceso
   - Toasts/notificaciones cuando se intente una acción sin permisos

### Ejemplo de Filtrado para Alumnos (CalificacionesListComponent)

```typescript
view = computed(() => {
  const cals = this.filtrados() as Calificacion[];
  const user = this.authService.currentUser();
  
  // Si es alumno, filtrar solo sus calificaciones
  const filteredCals = this.roleService.isAlumno() 
    ? cals.filter(c => c.alumnoId === user?.id)
    : cals;  // Otros roles ven todas
  
  // ... resto del computed
});
```

## Consideraciones de Seguridad

⚠️ **IMPORTANTE**: 
- Las directivas y guards son protección **a nivel de UI** solamente
- **SIEMPRE** implementar validación de permisos en el backend/API
- No confiar únicamente en la ocultación de elementos frontend
- Los alumnos no deben poder acceder a calificaciones de otros mediante URL directa

## Testing

### Casos de Prueba Recomendados

1. Iniciar sesión como cada rol y verificar:
   - Menú de navegación muestra solo rutas permitidas
   - Botones de acción solo aparecen según permisos
   - Intentar navegar a ruta no permitida redirige al dashboard

2. Verificar funcionalidad de cada componente por rol:
   - Alumno: Solo ve sus calificaciones
   - Profesor: Puede crear/editar calificaciones, ve alumnos y grupos
   - Jefatura: Gestión académica completa
   - Dirección: Ve todo, gestiona usuarios
   - Admin: Acceso total

---

**Estado**: ✅ Sistema de permisos implementado
**Próxima fase**: Aplicar permisos en todos los componentes CRUD restantes
**Compilación**: ✅ Exitosa (734.63 KB)
