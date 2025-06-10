import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { ArquivoDto } from '../../../dominio/models/arquivo.dto';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { ProfessorService } from '../../services/professor.service';
import { UsuarioDto } from '../../../aluno/models/cadastro-aluno.model';
import { CursoEnum } from '../../../dominio/enum/curso.enum';
import { SituacaoEnum } from '../../../dominio/enum/situacao.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-professor',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    FormsModule,
  ],
  templateUrl: './dashboard-professor.component.html',
  styleUrl: './dashboard-professor.component.css',
})
export class DashboardProfessorComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private service: ProfessorService) {}

  cursos = [
    { label: 'Gestão Ambiental', value: CursoEnum.GESTAO_AMBIENTAL },
    {
      label: 'Análise e Dev. de Sistemas',
      value: CursoEnum.ANALISE_DES_SISTEMA,
    },
  ];

  situacoes = [
    { label: 'Em Análise', value: SituacaoEnum.EM_ANALISE },
    { label: 'Aprovado', value: SituacaoEnum.APROVADO },
    { label: 'Recusado', value: SituacaoEnum.RECUSADO },
  ];

  getSituacaoLabel(value: SituacaoEnum): string {
    const situacao = this.situacoes.find((s) => s.value === value);
    return situacao ? situacao.label : value;
  }

  getCursoLabel(value: CursoEnum): string {
    const curso = this.cursos.find((s) => s.value === value);
    return curso ? curso.label : value;
  }

  usuario: any;
  horasAverbadas: number = 0;
  totalRegistros: number = 0;
  pageSize = 5;
  pageIndex = 0;

  filtros = {
    tipo: '', // valor do mat-select
    palavraChave: '', // valor do input de busca
    page: 0, // página atual
    size: 5, // tamanho da página
  };

  displayedColumns: string[] = [
    'aluno',
    'matricula',
    'atividade',
    'dimensao',
    'horasAverbadas',
    'situacao',
    'arquivo',
  ];

  dataSource: ArquivoDto[] = [];

  jwtHelper: JwtHelperService = new JwtHelperService();

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    if (token && usuarioId) {
      const decoded = this.jwtHelper.decodeToken(token);

      if (decoded && decoded.email) {
        this.carregarAtividades(this.pageIndex, this.pageSize);
        this.carregarDadosUsuario(usuarioId);
      } else {
        console.warn('Token inválido.');
        this.router.navigate(['/login']);
      }
    } else {
      console.warn('Token ou ID do usuário não encontrado.');
      this.router.navigate(['/login']);
    }
  }

  carregarDadosUsuario(usuarioId: number): void {
    this.service.buscarPorId(usuarioId).subscribe({
      next: (res) => {
        this.usuario = res;
      },
      error: () => {
        console.error('Erro ao buscar dados do usuário');
      },
    });
  }

  carregarAtividades(pageStart: number, pageSize: number): void {
    const filtros = {
      tipo: this.filtros.tipo || null,
      palavraChave: this.filtros.palavraChave || null,
      page: pageStart,
      size: pageSize,
    };

    this.service.getAllArquivo(pageStart, pageSize).subscribe({
      next: (response) => {
        this.dataSource = response.content || [];
        this.totalRegistros = response.totalRecords || 0;
      },
      error: (err) => {
        console.error('Erro ao buscar arquivos:', err);
      },
    });
  }

  /* carregarAtividades(pageStart: number, pageSize: number): void {
    this.service.getAllArquivo(pageStart, pageSize).subscribe({
      next: (response) => {
        console.log('Atividades recebidas:', response.content); // <-- Aqui
        this.dataSource = response.content || [];
        this.totalRegistros = response.totalRecords || 0;
      },
      error: (err) => {
        console.error('Erro ao buscar arquivos:', err);
      },
    });
  } */

  sair(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    this.router.navigate(['/login']);
  }

  enviarArquivo(): void {
    this.router.navigate(['/enviar-arquivo']);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.carregarAtividades(this.pageIndex, this.pageSize);
  }

  visualizarArquivo(arquivo: ArquivoDto): void {
    this.router.navigate(['/averbar-horas'], {
      queryParams: { id: arquivo.id },
    });
  }

  aplicarFiltros(): void {
    this.pageIndex = 0; // sempre volta para primeira página ao aplicar filtro
    this.carregarAtividades(this.pageIndex, this.pageSize);
  }
}
