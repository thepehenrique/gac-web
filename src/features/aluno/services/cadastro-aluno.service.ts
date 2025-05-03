import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDto } from '../models/cadastro-aluno.model';

@Injectable({
  providedIn: 'root',
})
export class CadastroAlunoService {
  private readonly API_URL = 'http://localhost:8080/usuario'; // URL base da API

  constructor(private http: HttpClient) {}

  /** Salva um novo aluno no banco de dados */
  salvar(usuario: UsuarioDto): Observable<UsuarioDto> {
    return this.http.post<UsuarioDto>(`${this.API_URL}`, usuario);
  }

  /** Busca um aluno pelo ID */
  buscarPorId(id: number): Observable<UsuarioDto> {
    return this.http.get<UsuarioDto>(`${this.API_URL}/${id}`);
  }

  /** Atualiza um aluno existente no banco de dados */
  atualizar(id: number, usuario: UsuarioDto): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, usuario);
  }
}
