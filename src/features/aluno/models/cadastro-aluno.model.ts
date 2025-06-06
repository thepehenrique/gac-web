import { CursoEnum } from '../../dominio/enum/curso.enum';
import { StatusEnum } from '../../dominio/enum/status.enum';
import { TurnoEnum } from '../../dominio/enum/turno.enum';

export interface UsuarioDto {
  id?: number; // <- opcional, para evitar erro de "missing id"
  idPerfil?: number;
  matricula?: string;
  nome: string;
  turno: TurnoEnum | null;
  curso: CursoEnum | null;
  email?: string;
  status?: StatusEnum;
}
