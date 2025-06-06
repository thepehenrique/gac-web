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
  selector: 'app-aprovar',
  templateUrl: './aprovar.component.html',
  styleUrls: ['./aprovar.component.css'],
})
export class AprovarComponent {
  horas: number = 20;

  constructor(private dialogRef: MatDialogRef<AprovarComponent>) {}

  confirmar() {
    this.dialogRef.close(this.horas);
  }
}
