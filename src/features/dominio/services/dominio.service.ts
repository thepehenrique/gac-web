import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationQueryResponseDto } from '../../aluno/models/pagination.model';
import { ArquivoDto } from '../../dominio/models/arquivo.dto';
import { UsuarioDto } from '../../aluno/models/cadastro-aluno.model';

@Injectable({
  providedIn: 'root',
})
export class DominioService {
  private readonly API_URL = 'http://localhost:8080/usuario';
  private apiUrl = 'http://localhost:8080/dominio/atividade';
  private APIURL = 'http://localhost:8080/dominio/arquivo';
  private URL_API = 'http://localhost:8080/arquivo';
  private URL_UP = 'http://localhost:8080/upload';

  constructor(private http: HttpClient) {}

  /** Busca um aluno pelo ID */
  buscarPorId(id: number): Observable<UsuarioDto> {
    return this.http.get<UsuarioDto>(`${this.API_URL}/${id}`);
  }

  getAllUsuario(
    pageStart: number,
    pageSize: number
  ): Observable<PaginationQueryResponseDto<UsuarioDto>> {
    return this.http.get<PaginationQueryResponseDto<UsuarioDto>>(
      `${this.API_URL}?pageStart=${pageStart}&pageSize=${pageSize}`
    );
  }

  /** Atualiza um aluno existente no banco de dados */
  atualizar(id: number, usuario: Partial<UsuarioDto>): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, usuario);
  }
}
