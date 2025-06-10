import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessorService } from '../services/professor.service';

@Component({
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'app-aprovar',
  templateUrl: './aprovar.component.html',
  styleUrls: ['./aprovar.component.css'],
})
export class AprovarComponent implements OnInit {
  arquivoId!: number;
  horasEnviadas!: number; // Horas enviadas pelo aluno
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private professorService: ProfessorService
  ) {}

  ngOnInit(): void {
    this.arquivoId = Number(this.route.snapshot.queryParamMap.get('id'));
    this.horasEnviadas = Number(
      this.route.snapshot.queryParamMap.get('horasEnviadas')
    );

    this.form = this.fb.group({
      horasAverbadas: [null, [Validators.required, Validators.min(1)]],
    });
  }

  aprovar(): void {
    const horas = this.form.value.horasAverbadas;

    if (!horas || horas <= 0) {
      alert('Informe um valor válido de horas.');
      return;
    }

    if (horas > this.horasEnviadas) {
      alert(
        `As horas averbadas não podem ser maiores que as horas enviadas pelo aluno (${this.horasEnviadas}).`
      );
      return;
    }

    this.professorService
      .atualizarSituacaoArquivo(this.arquivoId, true, horas)
      .subscribe({
        next: (res) => {
          alert('Horas averbadas com sucesso!');
          this.router.navigate(['/dashboard-professor']); // ajuste a rota!
        },
        error: (err) => console.error('Erro ao aprovar:', err),
      });
  }
}
