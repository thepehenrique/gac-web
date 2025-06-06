import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlunoService } from '../../services/aluno.service';
import { ArquivoDto } from '../../../dominio/models/arquivo.dto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioDto } from '../../models/cadastro-aluno.model';
import { TurnoEnum } from '../../../dominio/enum/turno.enum';
import { CursoEnum } from '../../../dominio/enum/curso.enum';

@Component({
  selector: 'app-enviar-arquivo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './enviar-arquivo.component.html',
  styleUrl: './enviar-arquivo.component.css',
})
export class EnviarArquivoComponent implements OnInit {
  atividades: any[] = [];
  fileName: string | null = null;
  selectedFile: File | null = null;
  somenteLeitura: boolean = false;

  arquivo: ArquivoDto = {
    idAtividade: 0,
    ano: 0,
    horas: 0,
    observacao: '',
  };

  usuario: UsuarioDto = {
    nome: '',
    turno: '' as TurnoEnum,
    curso: '' as CursoEnum,
  };

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: AlunoService
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

    this.service.getAtividades().subscribe({
      next: (dados) => {
        this.atividades = dados;
      },
      error: (err) => {
        console.error('Erro ao buscar atividades:', err);
      },
    });

    // Verifica se veio ID na rota
    this.route.queryParams.subscribe((params) => {
      const arquivoId = params['id'];
      const readonly = params['readonly'];

      if (readonly === 'true') {
        this.somenteLeitura = true;
      }

      if (arquivoId) {
        this.carregarArquivo(arquivoId);
      }
    });
  }

  carregarArquivo(id: number) {
    this.service.getArquivoPorId(id).subscribe({
      next: (dados) => {
        this.arquivo = {
          idAtividade: dados.idAtividade,
          ano: dados.ano,
          horas: dados.horas,
          observacao: dados.observacao,
        };
        this.fileName = dados.caminho_arquivo ?? null;
        // Aqui você decide se quer preencher também selectedFile, mas normalmente não é necessário para apenas visualizar.
      },
      error: (err) => {
        console.error('Erro ao carregar arquivo:', err);
      },
    });
  }

  // Evento de dragover para permitir o drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  voltar(): void {
    this.router.navigate(['/dashboard-aluno']);
  }

  sair(): void {
    this.router.navigate(['/login']);
  }

  enviar(): void {
    if (!this.selectedFile) {
      alert('Selecione um arquivo primeiro!');
      return;
    }

    if (!this.usuario.id) {
      alert('ID do usuário não encontrado!');
      return;
    }

    this.service
      .salvarArquivoFile(this.usuario.id, this.arquivo, this.selectedFile)
      .subscribe({
        next: () => {
          alert('Arquivo enviado com sucesso!');
          this.router.navigate(['/dashboard-aluno']);
        },
        error: (err) => {
          console.error('Erro ao enviar arquivo:', err);
          alert('Já existe um arquivo com este nome.');
        },
      });
  }
}
