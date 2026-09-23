import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginResponse } from '../../core/models/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  currentUser: LoginResponse | null;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.getCurrentUser();
  }

  get fullName(): string {
    if (!this.currentUser) {
      return '';
    }
    const name = `${this.currentUser.first_name} ${this.currentUser.last_name}`.trim();
    return name || this.currentUser.username;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
