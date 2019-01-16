import { AlertController, ToastController, ItemSliding } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Servico } from '../../domains/servico';

import { NavController, LoadingController } from '@ionic/angular';

import * as firebase from 'firebase';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage implements OnInit {

  // @ViewChild('slidingItem') slidingitem: ItemSliding;

  servico: Servico; // PEGA O SERVIÇO SELECIONADO
  servicos: Servico[]; // ARMAZENA TODOS OS SERVIÇOS SALVOS NO DB PARA LISTAR NA TELA

  ref = firebase.database().ref('servicos/'); // APONTO PARA MINHA TABELA NO FIREBASE

  public loading;
  duplicado = false;


  constructor(private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.ref.on('value', res => {
      this.servicos = [];
      this.servicos = this.snapshotToArray(res);
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
          this.ehDuplicado(data.nome);
          if (!this.duplicado) {
            this.presentAlert('Este serviço já esta cadastrado.');
          } else {
            const novoServico = firebase.database().ref('servicos/').push();
            data.id = novoServico.key;
            novoServico
              .set(data)
              .then(() => {
                this.presentToast('Serviço cadastrado com sucesso!');
              })
              .catch((err) => {
                this.presentToast('Erro!: ' + err);
              });
          }
        }
      }]
    });
    alert.present();
  }
  // -------------------------------------

  // REMOVER SERVIÇO
  async remove(id) { // , slidingItem: ItemSliding
    const alert = await this.alertCtrl.create({
      header: 'Excluir Serviço',
      subHeader: 'Deseja excluir permanentemente o serviço?',
      buttons: [
        {
          text: 'Sim',
          role: 'sim',
          handler: () => {
            console.log(id);
            // slidingItem.close(); // FECHA O SLIDING PARA REINICIAR (CORREÇÃO DE BUG NO SLIDING APÓS REMOÇÃO DE ITEM)
            firebase.database()
              .ref('servicos/' + id)
              .remove()
              .then(() => {
                this.presentToast('Serviço excluido com sucesso!');
              })
              .catch((err) => {
                this.presentToast(err);
              });
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

  // UPDATE SERVIÇO
  async update(id: string, nome: string) { // , slidingItem: ItemSliding
    const alert = await this.alertCtrl.create({
      header: 'Atualização de Serviço',
      inputs: [{
        name: 'nome',
        placeholder: 'Serviço',
        value: nome
      }],
      buttons: [{
        text: 'Fechar',
        handler: data => {
          return;
        }
      },
      {
        text: 'Atualizar',
        handler: (data: Servico) => {
          // this.slidingitem.close(); // FECHA O SLIDING PARA REINICIAR (CORREÇÃO DE BUG NO SLIDING APÓS REMOÇÃO DE ITEM)
          const atualizaServico = firebase.database().ref('servicos/' + id);
          atualizaServico
            .update(data)
            .then(() => {
              this.presentToast('Serviço atualizado com sucesso!');
            })
            .catch((err) => {
              this.presentToast('Erro!: ' + err);
            });
        }
      }]
    });
    await alert.present();
  }

  // ------------------------------------------------

  // VERIFICA SE EXISTE SERVIÇO
  ehDuplicado() {
  }

  // ------------------------------------------------

  //  INICIA O LOADING
  private async presentLoading(message: string) {
    this.loading = await this.loadingCtrl.create({
      message: message
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
  private async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }

  private async presentAlert(message: string) {
    const presentAlert = await this.alertCtrl.create({
      header: 'Aviso',
      subHeader: message,
      buttons: [{ text: 'Ok' }]
    });
    await presentAlert.present();
  }

  // CONVERTE O VALOR RECEBIDO DO FIREBASE PARA ARRAY
  snapshotToArray(res) {
    const array = [];
    res.forEach(childSnapshot => {
      const i = childSnapshot.val();
      i.key = childSnapshot.key;
      array.push(i);
    });
    return array;
  }

}
