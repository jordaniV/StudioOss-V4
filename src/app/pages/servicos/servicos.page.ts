import { AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Servico } from '../../domains/servico';
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

  duplicado = false;


  constructor(private alertCtrl: AlertController,
              private toastCtrl: ToastController) { }

  ngOnInit() { // CARREGO OS SERVIÇOS EM UM ARRAY PARA APRESENTAR NA LISTA
    this.ref.on('value', res => {
      this.servicos = [];
      this.servicos = this.snapshotToArray(res); // CONVERTO O TIPO DE DADO RECEBIDO DO FIREBASE PARA OBJECT
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
          if (data.nome === '') { // VERIFICA SE CAMPO ESTA PREENCHIDO
            this.presentAlert('Campo serviço não pode ficar em branco!');
          } else {
            data.nome = data.nome.toUpperCase(); // CONVERTE PARA MAIUSCULO
            this.ehDuplicado(data.nome); // VERIFICA SE É DUPLICADO O CADASTRO
            if (this.duplicado) {
              this.presentAlert('Este serviço já esta cadastrado.');
            } else {
              const novoServico = firebase.database().ref('servicos/').push(); // CRIA PUSH PARA SALVAR OS DADOS
              data.id = novoServico.key;
              novoServico
                .set(data) // ARMAZENA OS DADOS
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
  async remove(id) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Serviço',
      subHeader: 'Deseja excluir permanentemente o serviço?',
      buttons: [
        {
          text: 'Sim',
          role: 'sim',
          handler: () => {
            firebase.database() // METODO PRA REMOÇÃO BASEADO NO ID
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
  async update(id: string, nome: string) {
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
          data.nome = data.nome.toUpperCase(); // COLOCAR O SERVIÇO EM MAIUSCULA
          const atualizaServico = firebase.database().ref('servicos/' + id); // CRIA VARIAVEL PARA RECEBER A REFERENCIA COM O ID COLETADO
          atualizaServico // ATUALIZA REGISTRO
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

    firebase.database() // PEGA A REFERENCIA E CONVERTE O RETORNO DO FIREBASE EM OBJECT E ADD NO LISTASERVICO
      .ref('servicos/')
      .on('value', res => {
        this.listaServicos = [];
        this.listaServicos = this.snapshotToArray(res);
      });

    for (let index = 0; index <= this.listaServicos.length - 1; index++) { // ITERA ENCIMA DO LISTASERVIÇO E VERIFICA SE EXISTE SERVIÇO
      if (nome === this.listaServicos[index].nome) {
        this.duplicado = true;
        break;
      } else {
        this.duplicado = false;
      }
    }

  }

  // ------------------------------------------------

  // INICIA O TOAST
  private async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }

  // INICIA ALERT
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

  // IMPLEMENTAR O METODO DE IONINPUT DO SEARCHBAR
  search(e) {
    this.servicos = this.loadedServico;
    const q = e.srcElement.value;
    if (!q) {
      return;
    }
    this.servicos = this.servicos.filter((v) => {
      if (v.nome && q) {
        if (v.nome.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

}
