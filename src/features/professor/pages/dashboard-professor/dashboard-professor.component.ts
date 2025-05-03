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
  ],
  templateUrl: './dashboard-professor.component.html',
  styleUrl: './dashboard-professor.component.css',
})
export class DashboardProfessorComponent {
  constructor(private router: Router) {}

  displayedColumns: string[] = [
    'aluno',
    'curso',
    'situacao',
    'arquivo',
    'acoes',
    'comentar',
  ];
  dataSource = [
    {
      tipo: 'Ensino',
      horasAberbadas: '-',
      horasEnviadas: 20,
      ano: 2024,
      situacao: 'Aguardando Análise',
      acoes: 'Ver | Editar | Cancelar',
    },
    {
      tipo: 'Concílio',
      horasAberbadas: 30,
      horasEnviadas: 40,
      ano: 2024,
      situacao: 'Aprovada',
      acoes: 'Ver',
    },
    {
      tipo: 'Palestra',
      horasAberbadas: '-',
      horasEnviadas: 1,
      ano: 2024,
      situacao: 'Recusada',
      acoes: 'Ver',
    },
  ];

  sair(): void {
    this.router.navigate(['/login']);
  }

  enviarArquivo(): void {
    this.router.navigate(['/enviar-arquivo']);
  }
}
