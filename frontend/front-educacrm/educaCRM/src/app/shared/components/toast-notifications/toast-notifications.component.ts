import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      @for (notification of notificationService.items(); track notification.id) {
        <div 
          class="toast show" 
          [class.bg-success]="notification.type === 'success'"
          [class.bg-danger]="notification.type === 'error'"
          [class.bg-info]="notification.type === 'info'"
          [class.bg-warning]="notification.type === 'warning'"
          role="alert">
          <div class="d-flex align-items-center text-white p-2">
            <div class="toast-body flex-grow-1">
              <i class="bi" 
                 [class.bi-check-circle]="notification.type === 'success'"
                 [class.bi-x-circle]="notification.type === 'error'"
                 [class.bi-info-circle]="notification.type === 'info'"
                 [class.bi-exclamation-triangle]="notification.type === 'warning'">
              </i>
              {{ notification.message }}
            </div>
            <button 
              type="button" 
              class="btn-close btn-close-white me-2" 
              (click)="notificationService.remove(notification.id)">
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast {
      min-width: 300px;
      margin-bottom: 0.5rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .toast-body i {
      margin-right: 0.5rem;
      font-size: 1.2rem;
    }
  `]
})
export class ToastNotificationsComponent {
  constructor(public notificationService: NotificationService) {}
}
