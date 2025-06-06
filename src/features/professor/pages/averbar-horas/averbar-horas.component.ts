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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { ProfessorDto } from '../../models/cadastro-professor.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DominioService } from '../../../dominio/services/dominio.service';
import { UsuarioDto } from '../../../aluno/models/cadastro-aluno.model';
import { TurnoEnum } from '../../../dominio/enum/turno.enum';
import { CursoEnum } from '../../../dominio/enum/curso.enum';
import { ArquivoDto } from '../../../dominio/models/arquivo.dto';
import { AlunoService } from '../../../aluno/services/aluno.service';
import { MatDialog } from '@angular/material/dialog';
import { AprovarComponent } from '../../modal/aprovar.component';
import { RecusarComponent } from '../../modal/recusar.component';

@Component({
  selector: 'app-averbar-horas',
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
  templateUrl: './averbar-horas.component.html',
  styleUrl: './averbar-horas.component.css',
})
export class AverbarHorasComponent implements OnInit {
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
    private service: DominioService,
    private alunoService: AlunoService,
    private dialog: MatDialog
  ) {}

  carregarUsuario(usuarioId: number): void {
    this.service.buscarPorId(usuarioId).subscribe({
      next: (res) => {
        this.usuario = res;
      },
      error: () => {
        console.error('Erro ao buscar dados do usuário');
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

    this.alunoService.getAtividades().subscribe({
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
    this.alunoService.getArquivoPorId(id).subscribe({
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

  voltar(): void {
    this.router.navigate(['/dashboard-professor']);
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

  modalAprovar() {
    const dialogRef = this.dialog.open(AprovarComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log('Horas confirmadas:', result);
        // Aqui você pode salvar ou enviar os dados
      }
    });
  }

  modalRecusar() {
    const dialogRef = this.dialog.open(RecusarComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log('Motivo da recusa:', result);
        // Aqui você pode salvar ou enviar os dados
      }
    });
  }
}
