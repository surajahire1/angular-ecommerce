import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from "../shared/components/ui/notification/notification.component";
import { MainLayoutComponent } from '../shared/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'modern-ecommerce-ui';
}
