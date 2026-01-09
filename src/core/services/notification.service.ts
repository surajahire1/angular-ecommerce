import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private nextId = 1;

  showSuccess(message: string, duration: number = 3000): void {
    this.addNotification({
      id: this.nextId++,
      type: 'success',
      message,
      duration,
      dismissible: true
    });
  }

  showError(message: string, duration: number = 5000): void {
    this.addNotification({
      id: this.nextId++,
      type: 'error',
      message,
      duration,
      dismissible: true
    });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.addNotification({
      id: this.nextId++,
      type: 'warning',
      message,
      duration,
      dismissible: true
    });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.addNotification({
      id: this.nextId++,
      type: 'info',
      message,
      duration,
      dismissible: true
    });
  }

  private addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  removeNotification(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }
}
