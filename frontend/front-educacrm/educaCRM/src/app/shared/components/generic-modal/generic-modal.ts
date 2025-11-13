import { Component, input, output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #modalElement class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog" [ngClass]="modalSize()">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header" [ngClass]="headerClass()">
            <h5 class="modal-title">{{ title() }}</h5>
            <button type="button" class="btn-close" [class.btn-close-white]="headerClass().includes('text-white')" (click)="close()"></button>
          </div>
          
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close()">
              {{ cancelText() }}
            </button>
            <button type="button" class="btn" [ngClass]="confirmBtnClass()" (click)="onConfirm()">
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GenericModalComponent implements AfterViewInit {
  @ViewChild('modalElement') modalElement!: ElementRef<HTMLDivElement>;
  
  // Inputs
  title = input<string>('Modal');
  confirmText = input<string>('Guardar');
  cancelText = input<string>('Cancelar');
  modalSize = input<string>(''); // '', 'modal-lg', 'modal-xl', 'modal-sm'
  headerClass = input<string>('bg-primary text-white');
  confirmBtnClass = input<string>('btn-primary');
  
  // Outputs
  confirm = output<void>();
  cancel = output<void>();

  private modalInstance: any;

  ngAfterViewInit() {
    // Inicializar el modal de Bootstrap
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  open() {
    this.modalInstance?.show();
  }

  close() {
    this.modalInstance?.hide();
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
