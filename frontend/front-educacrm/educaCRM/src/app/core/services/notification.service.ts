import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private nextId = 1;

  readonly items = this.notifications.asReadonly();

  success(message: string, duration = 3000) {
    this.show('success', message, duration);
  }

  error(message: string, duration = 5000) {
    this.show('error', message, duration);
  }

  info(message: string, duration = 3000) {
    this.show('info', message, duration);
  }

  warning(message: string, duration = 4000) {
    this.show('warning', message, duration);
  }

  private show(type: Notification['type'], message: string, duration: number) {
    const notification: Notification = {
      id: this.nextId++,
      type,
      message,
      duration,
    };

    this.notifications.update((list) => [...list, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }

  remove(id: number) {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  clear() {
    this.notifications.set([]);
  }
}
