import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar';
import { ToastNotificationsComponent } from './shared/components/toast-notifications/toast-notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastNotificationsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {}