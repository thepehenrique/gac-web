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
import { AlunoService } from '../../services/aluno.service';
import { Atividade } from '../../../dominio/models/atividade.dto';
import { ArquivoDto } from '../../../dominio/models/arquivo.dto';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { SituacaoEnum } from '../../../dominio/enum/situacao.enum';
import { CursoEnum } from '../../../dominio/enum/curso.enum';

@Component({
  selector: 'app-dashboard-aluno',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  ],
  templateUrl: './dashboard-aluno.component.html',
  styleUrl: './dashboard-aluno.component.css',
})
export class DashboardAlunoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private alunoService: AlunoService) {}

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

  displayedColumns: string[] = [
    'tipo',
    'horasEnviadas',
    'horasAverbadas',
    'ano',
    'situacao',
    'acoes',
  ];

  dataSource: ArquivoDto[] = [];

  jwtHelper: JwtHelperService = new JwtHelperService();

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    if (token && usuarioId) {
      const decoded = this.jwtHelper.decodeToken(token);

      if (decoded && decoded.email) {
        this.carregarAtividades(usuarioId, this.pageIndex, this.pageSize);
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
    this.alunoService.buscarPorId(usuarioId).subscribe({
      next: (res) => {
        this.usuario = res;
      },
      error: () => {
        console.error('Erro ao buscar dados do usuário');
      },
    });
  }

  carregarAtividades(
    usuarioId: number,
    pageStart: number,
    pageSize: number
  ): void {
    this.alunoService.getArquivo(usuarioId, pageStart, pageSize).subscribe({
      next: (response) => {
        this.dataSource = response.content || [];
        this.totalRegistros = response.totalRecords || 0;

        // Atualizar a soma das horas averbadas
        this.horasAverbadas = this.dataSource.reduce((total, arquivo) => {
          return total + (arquivo.horasAverbadas || 0);
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao buscar arquivos:', err);
      },
    });
  }

  sair(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    this.router.navigate(['/login']);
  }

  enviarArquivo(): void {
    this.router.navigate(['/enviar-arquivo']);
  }

  verArquivo(arquivo: ArquivoDto): void {
    this.router.navigate(['/enviar-arquivo'], {
      queryParams: { id: arquivo.id, readonly: true },
    });
  }

  editarArquivo(arquivo: ArquivoDto): void {
    this.router.navigate(['/enviar-arquivo'], {
      queryParams: { id: arquivo.id },
    });
  }

  onPageChange(event: PageEvent) {
    const usuarioId = Number(localStorage.getItem('usuarioId'));
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.carregarAtividades(usuarioId, this.pageIndex, this.pageSize);
  }
}
