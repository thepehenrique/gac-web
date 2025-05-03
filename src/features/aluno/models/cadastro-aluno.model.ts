import { CursoEnum } from '../../dominio/enum/curso.enum';
import { TurnoEnum } from '../../dominio/enum/turno.enum';

export interface UsuarioDto {
  id?: number; // <- opcional, para evitar erro de "missing id"
  nome: string;
  turno: TurnoEnum | null;
  curso: CursoEnum | null;
  email?: string;
}
