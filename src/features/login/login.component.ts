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
      const tipoUsuario = +params['tipoUsuario']; // Convertido para número

      if (token && usuarioId) {
        localStorage.setItem('token', token);
        localStorage.setItem('usuarioId', usuarioId);
        localStorage.setItem('tipoUsuario', tipoUsuario.toString());

        if (novoUsuario) {
          if (tipoUsuario === 1) {
            this.router.navigate(['/dashboard-admin']);
          } else if (tipoUsuario === 2) {
            this.router.navigate(['/cadastro-aluno']);
          } else if (tipoUsuario === 3) {
            this.router.navigate(['/cadastro-professor']);
          } else {
            console.error('Tipo de usuário não suportado para cadastro.');
            this.router.navigate(['/login']);
          }
        } else {
          if (tipoUsuario === 1) {
            this.router.navigate(['/dashboard-admin']);
          } else if (tipoUsuario === 2) {
            this.router.navigate(['/dashboard-aluno']);
          } else if (tipoUsuario === 3) {
            this.router.navigate(['/dashboard-professor']);
          } else {
            this.router.navigate(['/login']);
          }
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
