import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { RoleService, Permission } from './role.service';
import { Role } from './auth.service';

/**
 * Directiva estructural para mostrar/ocultar elementos según permisos o roles.
 * 
 * @example
 * ```html
 * <!-- Por rol -->
 * <button *hasRole="'administrador'">Solo admins</button>
 * <button *hasRole="['administrador', 'direccion']">Admins o Dirección</button>
 * 
 * <!-- Por permiso -->
 * <button *hasPermission="'create_alumnos'">Crear alumno</button>
 * <button *hasPermission="['edit_alumnos', 'delete_alumnos']">Editar o eliminar</button>
 * ```
 */
@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  private roles: Role[] = [];

  @Input() set hasRole(roles: Role | Role[]) {
    this.roles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const hasAccess = this.roleService.hasRole(...this.roles);
    
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

/**
 * Directiva estructural para mostrar/ocultar elementos según permisos.
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private permissions: Permission[] = [];

  @Input() set hasPermission(permissions: Permission | Permission[]) {
    this.permissions = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const hasAccess = this.roleService.hasAnyPermission(...this.permissions);
    
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
