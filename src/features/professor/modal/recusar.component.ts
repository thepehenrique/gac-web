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
  selector: 'app-recusar',
  templateUrl: './recusar.component.html',
  styleUrls: ['./recusar.component.css'],
})
export class RecusarComponent implements OnInit {
  form!: FormGroup;
  arquivoId!: number;

  constructor(
    private fb: FormBuilder,
    private professorService: ProfessorService,
    private dialogRef: MatDialogRef<RecusarComponent>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.arquivoId = Number(this.route.snapshot.queryParamMap.get('id'));

    this.form = this.fb.group({
      comentario: ['', Validators.required],
    });
  }

  recusar(): void {
    if (!this.form.valid) {
      alert('Comentário é obrigatório.');
      return;
    }

    const comentario = this.form.value.comentario;

    this.professorService
      .atualizarSituacaoArquivo(
        this.arquivoId,
        false, // <== Arquivo será recusado
        undefined, // <== Não envia horasAverbadas
        comentario // <== COMENTÁRIO OBRIGATÓRIO
      )
      .subscribe({
        next: () => {
          alert('Arquivo recusado com sucesso!');
          this.dialogRef.close(true); // ou redireciona, como preferir
        },
        error: (err) => {
          console.error('Erro ao recusar:', err);
          alert(err.error?.message || 'Erro ao recusar o arquivo.');
        },
      });
  }
}
