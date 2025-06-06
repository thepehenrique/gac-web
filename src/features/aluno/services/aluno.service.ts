import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDto } from '../models/cadastro-aluno.model';
import { ArquivoDto } from '../../dominio/models/arquivo.dto';
import { PaginationQueryResponseDto } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private readonly API_URL = 'http://localhost:8080/usuario';
  private apiUrl = 'http://localhost:8080/dominio/atividade';
  private URL_API = 'http://localhost:8080/arquivo';
  private URL_UP = 'http://localhost:8080/upload';

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

  /** Busca as atividades cadastradas */
  getAtividades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** Salva um novo arquivo de um usuário no banco de dados */
  salvarArquivo(
    idUsuario: number,
    arquivo: ArquivoDto
  ): Observable<ArquivoDto> {
    return this.http.post<ArquivoDto>(`${this.API_URL}/${idUsuario}`, arquivo);
  }

  getArquivoPorId(id: number): Observable<ArquivoDto> {
    return this.http.get<ArquivoDto>(`${this.URL_API}/${id}`);
  }

  /* getArquivo(
    idUsuario: number,
    pageStart = 0,
    pageSize = 10
  ): Observable<{ content: ArquivoDto[] }> {
    return this.http.get<{ content: ArquivoDto[] }>(
      `${this.URL_API}/${idUsuario}/arquivo`,
      {
        params: {
          pageStart: pageStart.toString(),
          pageSize: pageSize.toString(),
        },
      }
    );
  } */

  getArquivo(
    usuarioId: number,
    pageStart: number,
    pageSize: number
  ): Observable<PaginationQueryResponseDto<ArquivoDto>> {
    return this.http.get<PaginationQueryResponseDto<ArquivoDto>>(
      `${this.URL_API}/${usuarioId}/arquivo?pageStart=${pageStart}&pageSize=${pageSize}`
    );
  }

  uploadArquivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.URL_UP}`, formData);
  }

  /** Envia um arquivo PDF com os dados do formulário para o backend */
  salvarArquivoFile(
    idUsuario: number,
    dados: ArquivoDto,
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('idAtividade', dados.idAtividade.toString());
    formData.append('ano', dados.ano.toString());
    formData.append('horas', dados.horas.toString());
    formData.append('observacao', dados.observacao || '');
    formData.append('file', file);

    return this.http.post(`${this.URL_API}/${idUsuario}`, formData);
  }

  getHorasUsuario(id: number) {
    return this.http.get<any>(`${this.API_URL}/horas/${id}`);
  }
}
