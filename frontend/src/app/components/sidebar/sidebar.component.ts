import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterModule, RouterLink],
})
export class SidebarComponent {
  user: any = null;
  
    constructor(
      private authService: AuthService,
      private router: Router
    ) {}
  
    ngOnInit() {
      this.user = this.authService.getCurrentUser();
    }

    logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
}