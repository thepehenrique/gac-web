import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { UsuarioDto } from '../features/aluno/models/cadastro-aluno.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/usuario';

  private googleAuthUrl = 'http://localhost:8080/auth/google';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  loginWithGoogle() {
    window.location.href = this.googleAuthUrl;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  /** Atualiza um aluno existente */
  /*  atualizar(id: number, usuario: UsuarioDto): Observable<UsuarioDto> {
    return this.http.put<UsuarioDto>(`${this.API_URL}/${id}`, usuario);
  } */

  atualizarUsuario(usuario: UsuarioDto): Observable<any> {
    return this.http.put(
      `http://localhost:8080/usuario/${usuario.id}`,
      usuario
    );
  }
}
