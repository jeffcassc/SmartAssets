import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/add-update-product/add-update-product.component';

import { orderBy } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSVc = inject(UtilsService)

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {
  }


  //==============cierre sesion=========
  signOut() {
    this.firebaseSvc.signOut();

  }

  user(): User {
    return this.utilsSVc.getFromLocalStorage('user')
  }
  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {

    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }
 

  //=========Obtener productos ===== 
  getProducts() {
    let path = `users/${this.user().uid}/products`;

    this.loading = true;

    let query = (
      orderBy('contCode', 'desc')
    )

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        this.loading = false
        sub.unsubscribe();
      }
    })
  }

  getPrestadoCont(): number{
    return this.products.filter(p => p.state === 'prestado').length
  }

  //======== agrergar o actualizar profucto ========
  async addUpdateProduct(product?: Product) {

    let success = await this.utilsSVc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })
    if (success) this.getProducts();
  }
  //===== confirmar eliminacion del producto ========
  async presentAlertConfirm(product: Product) {
    this.utilsSVc.presentAlert({
      header: 'Eliminar producto!',
      message: '¿Quieres Eliminar este producto?!!!',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',

        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product)
          }
        }
      ]
    });

  }


  // eliminar producto
  async deleteProduct(product: Product) {


    let path = `users/${this.user().uid}/products/${product.id}`
    //para que se muetre la rueda de carga
    const loading = await this.utilsSVc.loading();
    await loading.present();

    let imagepath = await this.firebaseSvc.getfilePath(product.Image);
    await this.firebaseSvc.deleteFile(imagepath);

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.products = this.products.filter(p => p.id !== product.id);


      this.utilsSVc.presentToast({
        message: 'Producto eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })


    }).catch(error => {
      console.error(error);
      //mostrar el error con un toast
      this.utilsSVc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss(); //aqui finaliza la rueda de carga sin importa si lo de mas a sido correcto o no
    })

  }
}
