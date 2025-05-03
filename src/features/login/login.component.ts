import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const usuarioId = params['usuarioId'];
      const novoUsuario = params['novoUsuario'] === 'true';

      if (token && usuarioId) {
        localStorage.setItem('token', token);
        localStorage.setItem('usuarioId', usuarioId);

        if (novoUsuario) {
          this.router.navigate(['/cadastro-aluno']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        console.error('Token ou ID de usuário não encontrados na URL.');
        this.router.navigate(['/login']);
      }
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
