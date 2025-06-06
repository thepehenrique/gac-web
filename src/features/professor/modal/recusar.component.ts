import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
  ],
  selector: 'app-recusar',
  templateUrl: './recusar.component.html',
  styleUrls: ['./recusar.component.css'],
})
export class RecusarComponent {
  observacao: string = '';

  constructor(private dialogRef: MatDialogRef<RecusarComponent>) {}

  confirmar() {
    this.dialogRef.close(this.observacao);
  }
}
