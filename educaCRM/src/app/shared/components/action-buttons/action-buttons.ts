import { Component, output } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  template: `
    <button class="btn btn-sm btn-outline-primary me-1" (click)="view.emit()">
      <i class="bi bi-eye"></i>
    </button>
    <button class="btn btn-sm btn-outline-secondary me-1" (click)="edit.emit()">
      <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-sm btn-outline-danger" (click)="delete.emit()">
      <i class="bi bi-trash"></i>
    </button>
  `
})
export class ActionButtonsComponent {
  view = output<void>();
  edit = output<void>();
  delete = output<void>();
}
