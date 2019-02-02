import { AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/domains/cliente';
import * as firebase from 'firebase';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  cliente: Cliente[]; // PEGA O CLIENTES SELECIONADO
  clientes: Cliente[]; // ARMAZENA TODOS OS CLIENTES SALVOS NO DB PARA LISTAR NA TELA
  listaClientes: Cliente[]; // PEGO A LISTA PARA VERIFICAÇÃO DE DUPLICIDADE
  loadedClientes: Cliente[]; // RECEBE O VALOR DE CLIENTES PARA A BUSCA NO SEARCHBAR

  ref = firebase.database().ref('clientes/');

  duplicado = false;

  constructor(private alertCtrl: AlertController,
    private toastCtrl: ToastController) { }

  ngOnInit() { // CARREGA OS SERVIÇOS EM UM ARRAY PARA APRESENTAR NA TELA
    this.ref.on('value', res => {
      this.clientes = [];
      this.clientes = this.snapshotToArray(res);
      this.loadedClientes = this.clientes;
    });
  }

  async add() {
    const alert = await this.alertCtrl.create({
      header: 'Cadastro de Cliente',
      inputs: [{
        name: 'nome',
        placeholder: 'Nome',
        type: 'text'
      },
      {
        name: 'telefone',
        placeholder: 'Telefone',
        type: 'number'
      },
      {
        name: 'obs',
        placeholder: 'Observações. (Opcional)'
      }],
      buttons: [{
        text: 'Fechar',
        handler: () => {
          return;
        }
      },
      {
        text: 'Salvar',
        handler: (data: Cliente) => {
          if (data.nome === '' || data.telefone === '') { // VERIFICA SE CAMPO ESTA PREENCHIDO
            this.presentAlert('Os campos não podem ficar em branco!');
          } else {
            data.nome = data.nome.toUpperCase(); // CONVERTE PARA MAIUSCULO
            data.obs = data.obs.toUpperCase(); // CONVERTE PARA MAIUSCULO
            this.ehDuplicado(data.nome); // VERIFICA SE É DUPLICADO O CADASTRO
            if (this.duplicado) {
              this.presentAlert('Este(a) cliente já esta cadastrado(a).');
            } else {
              const novoCliente = firebase.database().ref('clientes/').push(); // CRIA PUSH PARA SALVAR OS DADOS
              data.id = novoCliente.key;
              novoCliente
                .set(data) // ARMAZENA OS DADOS
                .then(() => {
                  this.presentToast('Cliente cadastrado(a) com sucesso!');
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

  async remove(id) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir cliente',
      subHeader: 'Deseja excluir permanentemente o(a) cliente?',
      buttons: [
        {
          text: 'Sim',
          role: 'sim',
          handler: () => {
            firebase.database() // METODO PRA REMOÇÃO BASEADO NO ID
              .ref('clientes/' + id)
              .remove()
              .then(() => {
                this.presentToast('Cliente excluido(a) com sucesso!');
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

  async update(cliente: Cliente) {
    const alert = await this.alertCtrl.create({
      header: 'Atualização de Cliente',
      inputs: [{
        name: 'nome',
        placeholder: 'Nome',
        type: 'text',
        value: cliente.nome
      },
      {
        name: 'telefone',
        placeholder: 'Telefone',
        type: 'number',
        value: cliente.telefone
      },
      {
        name: 'obs',
        placeholder: 'Observações. (Opcional)',
        value: cliente.obs
      }],
      buttons: [{
        text: 'Fechar',
        handler: data => {
          return;
        }
      },
      {
        text: 'Atualizar',
        handler: (data: Cliente) => {
          data.nome = data.nome.toUpperCase(); // COLOCAR O SERVIÇO EM MAIUSCULA
          data.obs = data.obs.toUpperCase();
          const atualizaCliente = firebase.database().ref('clientes/' + cliente.id);
          atualizaCliente // ATUALIZA REGISTRO
            .update(data)
            .then(() => {
              this.presentToast('Cliente atualizado com sucesso!');
            })
            .catch((err) => {
              this.presentToast('Erro!: ' + err);
            });
        }
      }]
    });
    await alert.present();
  }

  search(e) {
    this.clientes = this.loadedClientes;
    const q = e.srcElement.value;
    if (!q) {
      return;
    }
    this.clientes = this.clientes.filter((v) => {
      if (v.nome && q) {
        if (v.nome.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  // VERIFICA SE EXISTE SERVIÇO
  ehDuplicado(nome: string) {
    this.duplicado = false;

    firebase.database() // PEGA A REFERENCIA E CONVERTE O RETORNO DO FIREBASE EM OBJECT E ADD NO LISTASERVICO
      .ref('clientes/')
      .on('value', res => {
        this.listaClientes = [];
        this.listaClientes = this.snapshotToArray(res);
      });

    for (let index = 0; index <= this.listaClientes.length - 1; index++) { // ITERA ENCIMA DO LISTASERVIÇO E VERIFICA SE EXISTE SERVIÇO
      if (nome === this.listaClientes[index].nome) {
        this.duplicado = true;
        break;
      } else {
        this.duplicado = false;
      }
    }

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

  async call(cliente) {
    const alert = await this.alertCtrl.create({
      header: `Ligar para ${cliente.nome}?`,
      buttons: [{
        text: 'Não',
        handler: data => {
          return;
        }
      },
      {
        text: 'Sim',
        handler: data => {
          console.log('Ligar');
        }
      }]
    });
    await alert.present();
  }

  whats(cliente) {}

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


}
