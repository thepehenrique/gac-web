import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { UsuarioDto } from '../../../aluno/models/cadastro-aluno.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DominioService } from '../../../dominio/services/dominio.service';

@Component({
  selector: 'app-dashboard-admin',
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
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
})
export class DashboardAdminComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private dominioService: DominioService) {}

  usuario: any;
  horasAverbadas: number = 0;
  totalRegistros: number = 0;
  pageSize = 5;
  pageIndex = 0;

  displayedColumns: string[] = ['nome', 'tipo', 'matricula', 'status', 'acoes'];

  dataSource: UsuarioDto[] = [];

  jwtHelper: JwtHelperService = new JwtHelperService();

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    if (token && usuarioId) {
      const decoded = this.jwtHelper.decodeToken(token);

      if (decoded && decoded.email) {
        this.carregarDadosUsuario(usuarioId);
        this.carregarUsuarios(this.pageIndex, this.pageSize);
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
    this.dominioService.buscarPorId(usuarioId).subscribe({
      next: (res) => {
        this.usuario = res;
      },
      error: () => {
        console.error('Erro ao buscar dados do usuário');
      },
    });
  }

  carregarUsuarios(pageStart: number, pageSize: number): void {
    this.dominioService.getAllUsuario(pageStart, pageSize).subscribe({
      next: (response) => {
        this.dataSource = response.content || [];
        this.totalRegistros = response.totalRecords || 0;
      },
      error: (err) => {
        console.error('Erro ao buscar arquivos:', err);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.carregarUsuarios(this.pageIndex, this.pageSize);
  }

  sair(): void {
    this.router.navigate(['/login']);
  }

  enviarArquivo(): void {
    this.router.navigate(['/enviar-arquivo']);
  }
}
