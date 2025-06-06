// models/atividade.model.ts
export interface Atividade {
  tipo: string;
  horasAverbadas: number;
  horasEnviadas: number;
  ano: number;
  situacao: string;
  editavel: boolean;
  cancelavel: boolean;
}
