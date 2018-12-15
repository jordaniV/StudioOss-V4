import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public alertCtrl: AlertController) {}

  async info() {
    const alert = await this.alertCtrl.create({
      header: 'Desenvolvido por:',
      subHeader: 'Vinicius Jordani',
      message: 'Contato: jordani.developer@gmail.com',
      buttons: ['Ok']
    });
    await alert.present();
  }

}
