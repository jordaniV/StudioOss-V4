import { AlertController, ToastController, ItemSliding } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { Servico } from '../../domains/servico';

import { LoadingController } from '@ionic/angular';

import * as firebase from 'firebase';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage implements OnInit {

  servico: Servico; // PEGA O SERVIÇO SELECIONADO
  servicos: Servico[]; // ARMAZENA TODOS OS SERVIÇOS SALVOS NO DB PARA LISTAR NA TELA
  listaServicos: Servico[]; // PEGO A LISTA PARA VERIFICAÇÃO DE DUPLICIDADE
  loadedServico: Servico[]; // RECEBE O VALOR DE SERVIÇOS PARA A BUSCA NO SEARCHBAR

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
      this.loadedServico = this.servicos;
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
        handler: () => {
          return;
        }
      },
      {
        text: 'Salvar',
        handler: (data: Servico) => {
          if (data.nome === '') {
            this.presentAlert('Campo serviço não pode ficar em branco!');
          } else {
            data.nome = data.nome.toUpperCase();
            this.ehDuplicado(data.nome);
            if (this.duplicado) {
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
          data.nome = data.nome.toUpperCase();
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
  ehDuplicado(nome: string) {
    this.duplicado = false;

    firebase.database()
      .ref('servicos/')
      .on('value', res => {
        this.listaServicos = [];
        this.listaServicos = this.snapshotToArray(res);
      });

    console.log('tamanhO listServico: ' + this.listaServicos.length);

    for (let index = 0; index <= this.listaServicos.length - 1; index++) {
      console.log('Index: ' + index + ' ID: ' + this.listaServicos[index].id + ' Nome: ' + this.listaServicos[index].nome);
      if (nome === this.listaServicos[index].nome) {
        this.duplicado = true;
        console.log('igual: ' + this.duplicado);
        break;
      } else {
        this.duplicado = false;
        console.log('Diferente: ' + this.duplicado);
      }
    }

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

  search(e) {
    this.servicos = this.loadedServico;
    const q = e.srcElement.value;
    if (!q) {
      return;
    }
    this.servicos = this.servicos.filter((v) => { // DDEPOIS TROCAR LOADEDSERVICO POR SERVICOS
      if (v.nome && q) {
        if (v.nome.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

}
