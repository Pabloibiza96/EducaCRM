import { Component, input, output, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActionButtonsComponent } from '../action-buttons/action-buttons';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  template?: TemplateRef<any>;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [ActionButtonsComponent, NgTemplateOutlet],
  template: `
    <div class="table-responsive shadow-sm rounded">
      <table class="table table-striped align-middle mb-0">
        <thead class="table-light">
          <tr>
            @for (col of columns(); track col.key) {
              <th>{{ col.label }}</th>
            }
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (item of data(); track trackBy()(item)) {
            <tr>
              @for (col of columns(); track col.key) {
                <td>
                  @if (col.template) {
                    <ng-container [ngTemplateOutlet]="col.template" [ngTemplateOutletContext]="{$implicit: item}"></ng-container>
                  } @else {
                    {{ item[col.key] }}
                  }
                </td>
              }
              <td class="text-end">
                <app-action-buttons
                  (view)="onView.emit(item)"
                  (edit)="onEdit.emit(item)"
                  (delete)="onDelete.emit(item)">
                </app-action-buttons>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class DataTableComponent<T> {
  data = input.required<T[]>();
  columns = input.required<TableColumn<T>[]>();
  trackBy = input.required<(item: T) => any>();
  
  onView = output<T>();
  onEdit = output<T>();
  onDelete = output<T>();
}
