import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  role: string | null;

  constructor(private authService: AuthService) {
    this.role = this.authService.getRole();
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN' || this.role === 'MANAGER';
  }
}
