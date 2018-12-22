import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  { path: 'novoAgendamento',
    loadChildren: './pages/novo-agendamento/novo-agendamento.module#NovoAgendamentoPageModule'
  },
  { path: 'agendamentos',
    loadChildren: './pages/agendamentos/agendamentos.module#AgendamentosPageModule'
  },
  { path: 'clientes',
    loadChildren: './pages/clientes/clientes.module#ClientesPageModule'
  },
  { path: 'servicos',
    loadChildren: './pages/servicos/servicos.module#ServicosPageModule'
  },
  { // PARA ACESSAR UM REGISTRO PELO SEU ID, LOADCHILDREN É O MESMO DA PAGINA RAIZ
    path: 'servicos/:id',
    loadChildren: './pages/servicos/servicos.module#ServicosPageModule'
  },
  { path: 'servico', loadChildren: './modals/servico/servico.module#ServicoPageModule' },
  { path: 'modal-servico', loadChildren: './modals/modal-servico/modal-servico.module#ModalServicoPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
