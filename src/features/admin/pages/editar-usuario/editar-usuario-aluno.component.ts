import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { StatusEnum } from '../../../dominio/enum/status.enum';

@Component({
  selector: 'app-editar-usuario-aluno',
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
  ],
  templateUrl: './editar-usuario-aluno.component.html',
  styleUrl: './editar-usuario-aluno.component.css',
})
export class EditarUsuarioAlunoComponent {
  constructor(private router: Router) {}
  status = Object.values(StatusEnum);

  sair(): void {
    this.router.navigate(['/login']);
  }

  enviarArquivo(): void {
    this.router.navigate(['/enviar-arquivo']);
  }
}
