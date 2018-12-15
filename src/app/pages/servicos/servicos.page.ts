import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage implements OnInit {

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  // ADICIONAR NOVO SERVIÇO
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

}
