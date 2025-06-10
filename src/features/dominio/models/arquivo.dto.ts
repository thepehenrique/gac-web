import { SituacaoEnum } from '../enum/situacao.enum';

export interface ArquivoDto {
  id?: number;
  idAtividade: number;
  ano: number;
  horas: number;
  horasAverbadas?: number;
  observacao: string;
  caminho_arquivo?: string;
  situacao?: SituacaoEnum;
}
