import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
