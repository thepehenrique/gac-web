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
import { RecusarComponent } from '../../modal/recusar.component';
import { AprovarComponent } from '../../modal/aprovar.component';
import { SituacaoEnum } from '../../../dominio/enum/situacao.enum';
import { ProfessorService } from '../../services/professor.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-averbar-horas',
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
    situacao: SituacaoEnum.EM_ANALISE,
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
    private dialog: MatDialog,
    private professorService: ProfessorService,
    private sanitizer: DomSanitizer
  ) {}

  get finalizado(): boolean {
    return (
      this.arquivo.situacao === SituacaoEnum.APROVADO ||
      this.arquivo.situacao === SituacaoEnum.RECUSADO
    );
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

        this.carregarUsuario(this.usuario.id);
      }
    }

    this.alunoService.getAtividades().subscribe({
      next: (dados) => {
        this.atividades = dados;
      },
      error: (err) => {
        console.error('Erro ao buscar atividades:', err);
      },
    });

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

  carregarArquivo(id: number) {
    this.alunoService.getArquivoPorId(id).subscribe({
      next: (dados) => {
        console.log('📄 Dados do arquivo recebido:', dados);

        this.arquivo = {
          idAtividade: dados.idAtividade,
          ano: dados.ano,
          horas: dados.horas,
          observacao: dados.observacao,
          situacao: dados.situacao,
        };

        this.fileName = dados.caminho_arquivo ?? null; // <- IMPORTANTE
      },
      error: (err) => {
        console.error('Erro ao carregar arquivo:', err);
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard-professor']);
  }

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
      }
    });
  }

  getDownloadUrl(): string | null {
    if (!this.fileName) return null;
    return this.professorService.getDownloadUrl(this.fileName);
  }

  getFileUrl(): SafeResourceUrl | null {
    if (!this.fileName) return null;
    const url = this.professorService.getDownloadUrl(this.fileName);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
