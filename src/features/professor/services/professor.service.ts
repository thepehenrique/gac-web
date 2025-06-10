import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfessorDto } from '../models/cadastro-professor.model';
import { Observable } from 'rxjs';
import { PaginationQueryResponseDto } from '../../aluno/models/pagination.model';
import { ArquivoDto } from '../../dominio/models/arquivo.dto';
import { SituacaoEnum } from '../../dominio/enum/situacao.enum';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private readonly API_URL = 'http://localhost:8080/usuario';
  private apiUrl = 'http://localhost:8080/dominio/atividade';
  private APIURL = 'http://localhost:8080/dominio/arquivo';
  private URL_API = 'http://localhost:8080/arquivo';
  private URL_UP = 'http://localhost:8080/upload';

  constructor(private http: HttpClient) {}

  /** Busca um aluno pelo ID */
  buscarPorId(id: number): Observable<ProfessorDto> {
    return this.http.get<ProfessorDto>(`${this.API_URL}/${id}`);
  }

  /** Atualiza um aluno existente no banco de dados */
  atualizar(id: number, usuario: Partial<ProfessorDto>): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, usuario);
  }

  getAllArquivo(
    pageStart: number,
    pageSize: number
  ): Observable<PaginationQueryResponseDto<ArquivoDto>> {
    return this.http.get<PaginationQueryResponseDto<ArquivoDto>>(
      `${this.APIURL}?pageStart=${pageStart}&pageSize=${pageSize}`
    );
  }

  atualizarSituacaoArquivo(
    id: number,
    aprovado: boolean,
    horasAverbadas?: number,
    comentario?: string
  ): Observable<number> {
    const body: any = {
      aprovado, // É isso que o backend espera
    };

    if (aprovado) {
      body.horasAverbadas = horasAverbadas;
    } else {
      body.comentario = comentario;
    }

    return this.http.put<number>(`${this.URL_API}/${id}/situacao`, body);
  }

  getDownloadUrl(fileName: string): string {
    return `${this.URL_API}/download/${fileName}`;
  }
}
