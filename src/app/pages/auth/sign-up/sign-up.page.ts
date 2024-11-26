import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit  {

  ngOnInit() {
    
  }

  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.min(20)]),
    rol: new FormControl('user') // Aquí defines el valor por defecto.
  })

  async submit(){
    if (this.form.valid) {
      //para que se muetre la rueda de carga
      const loading = await this.utilsSvc.loading();
      await loading.present();
      
      //registrar
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        //se le agrega el nombre
        await this.firebaseSvc.updateUser(this.form.value.name);
        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);

        this.setUserInfo(uid);

        
      }).catch(error => {
        console.error(error);
        //mostrar el error con un toast
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
        
      }).finally(()=>{
        loading.dismiss(); //aqui finaliza la rueda de carga sin importa si lo de mas a sido correcto o no
      })
    }
  }

  async setUserInfo(uid : string){
    if (this.form.valid) {
      //para que se muetre la rueda de carga
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;
      
      
      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
        this.utilsSvc.saveInLocalStorage('user',this.form.value)
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();

      }).catch(error => {
        console.error(error);
        //mostrar el error con un toast
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
        
      }).finally(()=>{
        loading.dismiss(); //aqui finaliza la rueda de carga sin importa si lo de mas a sido correcto o no
      })
    }
  }

  
}