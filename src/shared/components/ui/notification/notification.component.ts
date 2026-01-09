import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { Notification } from '../../../../core/models/notification.interface';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications"
           class="alert alert-{{notification.type}} alert-dismissible fade show"
           role="alert">
        {{notification.message}}
        <button type="button"
                class="btn-close"
                (click)="dismiss(notification.id)"
                *ngIf="notification.dismissible">
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 350px;
    }
    .alert {
      margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  `]
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );
  }

  dismiss(id: number): void {
    this.notificationService.removeNotification(id);
  }
}
