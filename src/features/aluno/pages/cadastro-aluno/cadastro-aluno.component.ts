import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioDto } from '../../models/cadastro-aluno.model';
import { TurnoEnum } from '../../../dominio/enum/turno.enum';
import { CursoEnum } from '../../../dominio/enum/curso.enum';
import { AuthService } from '../../../../auth/auth.service';
import { AlunoService } from '../../services/aluno.service';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
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
  templateUrl: './cadastro-aluno.component.html',
  styleUrls: ['./cadastro-aluno.component.css'],
})
export class CadastroAlunoComponent implements OnInit {
  turnos = [
    { label: 'Manhã', value: TurnoEnum.MANHA },
    { label: 'Noite', value: TurnoEnum.NOITE },
  ];

  cursos = [
    { label: 'Gestão Ambiental', value: CursoEnum.GESTAO_AMBIENTAL },
    {
      label: 'Análise e Desenvolvimento de Sistemas',
      value: CursoEnum.ANALISE_DES_SISTEMA,
    },
  ];

  usuario: UsuarioDto = {
    nome: '',
    turno: '' as TurnoEnum,
    curso: '' as CursoEnum,
  };

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private router: Router, private alunoService: AlunoService) {}

  carregarUsuario(id: number): void {
    this.alunoService.buscarPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/login']);
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

    this.alunoService.atualizar(this.usuario.id, this.usuario).subscribe({
      next: () => {
        alert('Cadastro atualizado com sucesso!');
        this.router.navigate(['/dashboard-aluno']); // ou outra tela principal
      },
      error: (err) => {
        console.error('Erro ao atualizar', err);
        alert('Erro ao atualizar cadastro.');
      },
    });
  }
}
