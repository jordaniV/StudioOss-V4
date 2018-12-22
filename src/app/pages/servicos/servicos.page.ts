import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { Servico } from '../../domains/servico';
import { ServicoService } from '../../services/servico/servico.service';

import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage implements OnInit {

  servico: Servico; // PEGA O SERVIÇO SELECIONADO PARA ATUALIZAÇÃO
  servicos: Servico[]; // ARMAZENA TODOS OS SERVIÇOS SALVOS NO DB PARA LISTAR NA TELA

  servicoId = null; // ID DO SERVIÇO SELECIONADO

  constructor(private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private servicoService: ServicoService,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    // CARREGA OS SERVIÇOS PARA SEREM LISTADOS NA TELA
    this.servicoService.getAll().subscribe(res => {
      this.servicos = res;
    });
  }

  // CARREGA OS DADOS DO SERVIÇO SELECIONADO PARA ATUALIZAÇÃO
  async load() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...'
    });
    await loading.present();

    this.servicoService.getServico(this.servicoId).subscribe(res => {
      loading.dismiss();
      this.servico = res;
    });
  }
  // --------------------------------------------------------

  // SALVA NOVO SERVIÇO CADASTRADO
  async save() {
    const loading = await this.loadingCtrl.create({
      message: 'Salvando...'
    });
    await loading.present();

    if (this.servicoId) {
      this.servicoService.update(this.servico, this.servicoId).then(() => {
        loading.dismiss();
        this.navCtrl.navigateBack('home');
      });
    } else {
      this.servicoService.add(this.servico).then(() => {
        loading.dismiss();
        this.navCtrl.navigateBack('home');
      });
    }
  }
  // ----------------------------------

  // ATUALIZAÇÃO DE SERVIÇO - CODIGO NAO ESTA CORRETO
  async update() {
    this.servicoId = this.route.snapshot.params['id'];
    if (this.servicoId) {
      this.load();
    }
  }
  // -------------------------------------

  // REMOVER SERVIÇO - MELHORAR ESTE METODO
  remove(item) {
    this.servicoService.remove(item.id);
  }
  // ---------------------------------------

  // METODO CHAMADO PELO BOTAO FAB PARA ADICIONAR NOVO SERVIÇO - NAO FUNCIONA CORETAMENTE
  async addServico() {

    const alert = await this.alertCtrl.create({
      header: 'Cadastro Serviços',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Serviço'
        }
      ],
      buttons: [
        {
          text: 'Salvar',
          role: 'salvar',
          handler: () => {
            // FUNÇÃO SALVAR SERVIÇO
            this.save();
          }
        },
        {
          text: 'Sair',
          role: 'sair',
          handler: () => {
            return;
          }
        }
      ]
    });
    await alert.present();
  }
  // --------------------------------------------------------

}
