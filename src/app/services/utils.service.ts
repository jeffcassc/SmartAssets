import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController); // para mostrar el error en pantalla si inician mal
  router = inject(Router)
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);



  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'seleccione una imagen',
      promptLabelPicture: 'toma una foto'
    });


  };
  //=========alerta
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
  
    await alert.present();
  }



  //================ loading ======================
  //para que aparezca la ruedita de carga
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  //================ toast ======================
  //para que se muestre un mensaje de error al usuario
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }


  //=========== enruta a culaquier pagina disponible ======
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //================ guarda un elemento en LocalStorage===========

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value)) //el JSON.stringify(value) para convertirlo en string ya que todo lo que este en localstorage de ser un xstring 

  }
  //=============== obtiene un elemento desde localstorage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key)) //el json.parse para volver a convertirlo en un objeto
  }

  //============== modal =================
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) return data;

  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data)
  }

}
