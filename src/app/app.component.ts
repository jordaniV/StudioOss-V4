import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBf9lUN3UhuntbY-lra7A_OWloCLGpqtv0',
  authDomain: 'studio-oss-v4.firebaseapp.com',
  databaseURL: 'https://studio-oss-v4.firebaseio.com',
  projectId: 'studio-oss-v4',
  storageBucket: 'studio-oss-v4.appspot.com',
  messagingSenderId: '491123982566'
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Início',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Agendamentos',
      url: '/agendamentos',
      icon: 'calendar'
    },
    {
      title: 'Novo Agendamento',
      url: '/novoAgendamento',
      icon: 'create'
    },
    {
      title: 'Clientes',
      url: '/clientes',
      icon: 'person'
    },
    {
      title: 'Serviços',
      url: '/servicos',
      icon: 'list-box'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
