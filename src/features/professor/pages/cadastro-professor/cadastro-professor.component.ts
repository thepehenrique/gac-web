import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfessorDto } from '../../models/cadastro-professor.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { TurnoEnum } from '../../../dominio/enum/turno.enum';
import { CursoEnum } from '../../../dominio/enum/curso.enum';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlunoService } from '../../../aluno/services/aluno.service';
import { ProfessorService } from '../../services/professor.service';

@Component({
  selector: 'app-cadastro-professor',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './cadastro-professor.component.html',
  styleUrl: './cadastro-professor.component.css',
})
export class CadastroProfessorComponent implements OnInit {
  usuario: ProfessorDto = {
    nome: '',
    curso: '',
  };

  cursos = [
    { label: 'Gestão Ambiental', value: CursoEnum.GESTAO_AMBIENTAL },
    {
      label: 'Análise e Desenvolvimento de Sistemas',
      value: CursoEnum.ANALISE_DES_SISTEMA,
    },
  ];

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private router: Router,
    private service: ProfessorService
  ) {}

  carregarUsuario(id: number): void {
    this.service.buscarPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
      },
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');

    if (token && usuarioId) {
      const decodedToken: any = this.jwtHelper.decodeToken(token);

      if (decodedToken && decodedToken.email && decodedToken.nome) {
        this.usuario.id = +usuarioId;
        this.usuario.email = decodedToken.email;
        this.usuario.nome = decodedToken.nome;

        console.log('Usuário inicial:', this.usuario);

        this.carregarUsuario(this.usuario.id);
      } else {
        console.warn('Token inválido ou incompleto:', decodedToken);
      }
    } else {
      console.warn('Token ou ID do usuário não encontrados no localStorage.');
    }
  }

  atualizarUsuario() {
    if (!this.usuario.id || !this.usuario.email) {
      alert('Dados do usuário estão incompletos.');
      return;
    }

    const payload = {
      nome: this.usuario.nome,
      curso: this.usuario.curso,
      // Adicione aqui apenas os campos permitidos pelo DTO no backend.
    };

    this.service.atualizar(this.usuario.id, payload).subscribe({
      next: () => {
        alert('Cadastro atualizado com sucesso!');
        this.router.navigate(['/dashboard-professor']);
      },
      error: (err) => {
        console.error('Erro ao atualizar', err);
        alert('Erro ao atualizar cadastro.');
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }
}
