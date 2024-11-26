import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    
  })

  ngOnInit() {
    
  }

  async submit(){
    if (this.form.valid) {
      //para que se muetre la rueda de carga
      const loading = await this.utilsSvc.loading();
      await loading.present();
      
      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {
        this.utilsSvc.presentToast({
          message: 'Correo enviado con exito',
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        });

        this.utilsSvc.routerLink('/auth');
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
