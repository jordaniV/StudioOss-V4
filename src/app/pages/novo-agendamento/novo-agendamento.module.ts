import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NovoAgendamentoPage } from './novo-agendamento.page';

const routes: Routes = [
  {
    path: '',
    component: NovoAgendamentoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NovoAgendamentoPage]
})
export class NovoAgendamentoPageModule {}
