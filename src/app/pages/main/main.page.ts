import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    {title: 'Mis Productos Prestados',url: '/main/borrowed-products',icon: 'archive-outline',condition: () => this.user()?.rol === 'user'},
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' },
    { title: 'Solicitudes', url: '/main/requests', icon: 'list-outline', condition: () => this.user()?.rol === 'admin' },
    { title: 'Usuarios', url: '/main/users', icon: 'people-outline', condition: () => this.user()?.rol === 'admin' },
    
  ];
  
  

  router = inject(Router);
  currentPath: string='';
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
    this.router.events.subscribe((event: any) =>{
      if(event?.url) this.currentPath = event.url;
    })
  }
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user')
  }

  signOut(){
    this.firebaseSvc.signOut();
  }

}
