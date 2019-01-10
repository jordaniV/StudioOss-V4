import { AlertController, ModalController, ToastController, ItemSliding } from '@ionic/angular';
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


  servico: Servico; // PEGA O SERVIÇO SELECIONADO
  servicos: Servico[]; // ARMAZENA TODOS OS SERVIÇOS SALVOS NO DB PARA LISTAR NA TELA

  servicoId = null; // ID DO SERVIÇO SELECIONADO

  private loading: any;


  constructor(private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private servicoService: ServicoService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.servicoService.getAll().subscribe((res: Servico[]) => {
      console.log('Carregou serviços...');
      this.servicos = res;
    });
  }

  // ADD SERVIÇO NOVO
  async add() {

    const alert = await this.alertCtrl.create({
      header: 'Cadastro de Serviço',
      inputs: [{
        name: 'nome',
        placeholder: 'Serviço'
      }],
      buttons: [{
        text: 'Fechar',
        handler: data => {
          return;
        }
      },
      {
        text: 'Salvar',
        handler: (data: Servico) => {
          this.presentLoading();
          this.servicoService
            .add(data)
            .then(() => {
              this.dismissLoading();
              this.presentToast('Serviço cadastrado com sucesso!');
              return;
            })
            .catch((err) => {
              this.dismissLoading();
              this.presentToast(err);
              return;
            });
        }
      }]
    });
    alert.present();
  }
  // -------------------------------------

  // REMOVER SERVIÇO
  async remove(id: string, slidingItem: ItemSliding) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Serviço',
      subHeader: 'Deseja excluir permanentemente o serviço?',
      buttons: [
        {
          text: 'Sim',
          role: 'sim',
          handler: () => {
            slidingItem.close(); // FECHA O SLIDING PARA REINICIAR (CORREÇÃO DE BUG NO SLIDING APÓS REMOÇÃO DE ITEM)
            this.servicoService.remove(id)
              .then(() => {
                this.presentToast('Serviço excluído com sucesso!');
              })
              .catch((err) => this.presentToast(err));
          }
        },
        {
          text: 'Não',
          handler: () => {
            return;
          }
        }
      ]
    });
    await alert.present();
  }
  // ---------------------------------------

  //  INICIA O LOADING
  private async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Salvando...'
    });
    this.loading.present();
  }
  // --------------------------

  // FECHA O LOADING
  private dismissLoading() {
    this.loading.dismiss();
  }
  // --------------------------

  // INICIA O TOAST
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }
}
