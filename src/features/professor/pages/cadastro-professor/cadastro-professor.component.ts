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
import { UsuarioDto } from '../../models/cadastro-professor.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';

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
  cadastroForm: FormGroup;
  token: string | null = null;

  usuario: UsuarioDto = {
    nome: '',
    turno: '',
    curso: '',
  };

  turnos = ['MANHA', 'TARDE', 'NOITE']; // Ajuste de acordo com seu `TurnoEnum`
  cursos = [
    'Gestão Ambiental',
    'Sistemas de Informação',
    'Análise e Desenvolvimento de Sistemas',
  ]; // Ajuste conforme `CursoEnum`

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      turno: ['', Validators.required],
      curso: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }

  salvarCadastro() {
    if (this.cadastroForm.valid && this.token) {
      this.authService.atualizarUsuario(this.cadastroForm.value).subscribe({
        next: () => {
          alert('Cadastro atualizado com sucesso!');
          this.router.navigate(['/usuario']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          alert('Erro ao cadastrar usuário.');
        },
      });
    }
  }
}
