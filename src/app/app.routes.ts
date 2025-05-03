import { Routes } from '@angular/router';
import { LoginComponent } from '../features/login/login.component';
import { UsuarioComponent } from '../features/usuario/usuario.component';
import { CadastroProfessorComponent } from '../features/professor/pages/cadastro-professor/cadastro-professor.component';
import { CadastroAlunoComponent } from '../features/aluno/pages/cadastro-aluno/cadastro-aluno.component';
import { DashboardAlunoComponent } from '../features/aluno/pages/dashboard-aluno/dashboard-aluno.component';
import { EnviarArquivoComponent } from '../features/aluno/pages/enviar-arquivo/enviar-arquivo.component';
import { DashboardProfessorComponent } from '../features/professor/pages/dashboard-professor/dashboard-professor.component';
import { AverbarHorasComponent } from '../features/professor/pages/averbar-horas/averbar-horas.component';
import { DashboardAdminComponent } from '../features/admin/pages/dashboard-admin/dashboard-admin.component';
import { EditarUsuarioAlunoComponent } from '../features/admin/pages/editar-usuario/editar-usuario-aluno.component';
import { EditarUsuarioProfessorComponent } from '../features/admin/pages/editar-usuario/editar-usuario-professor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-aluno', component: CadastroAlunoComponent },
  { path: 'cadastro-professor', component: CadastroProfessorComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'dashboard-aluno', component: DashboardAlunoComponent },
  { path: 'dashboard-professor', component: DashboardProfessorComponent },
  { path: 'enviar-arquivo', component: EnviarArquivoComponent },
  { path: 'averbar-horas', component: AverbarHorasComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'editar-usuario-aluno', component: EditarUsuarioAlunoComponent },
  {
    path: 'editar-usuario-professor',
    component: EditarUsuarioProfessorComponent,
  },
];
