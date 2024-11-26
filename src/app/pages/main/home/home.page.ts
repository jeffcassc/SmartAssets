import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/add-update-product/add-update-product.component';

import { orderBy } from 'firebase/firestore';
import { RequestLoanComponent } from 'src/app/shared/request-loan/request-loan.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSVc = inject(UtilsService);

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
    let path = `products`;

    this.loading = true;

    let query = (
      orderBy('name', 'desc')
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
  solicitud

  //obtener el producto 3 productos mas solicitados:
  
//obtener los produtos que han sido prestados para conteo
  getPrestadoCont(): number{
    return this.products.filter(p => p.state === 'prestado').length
  }

  async requestProduct(product: Product) {
    const modal = await this.utilsSVc.presentModal({
      component: RequestLoanComponent,
      componentProps: { product },
    });
  
    if (modal) {
      //para contar al cantida de solicitudes que tiene un producto
      const pathProduct = `products/${product.id}`;
        await this.firebaseSvc.UpdateDocument(pathProduct, {
            requestCount: (product.requestCount || 0) + 1
        });
      // Aquí puedes agregar lógica adicional después de enviar la solicitud
      this.getProducts();
    }
  }

  //dar los 3 productos mas solicitados
  getTopRequestedProducts(): Product[] {
    return [...this.products]
        .sort((a, b) => (b.requestCount || 0) - (a.requestCount || 0)) // Ordenar por mayor cantidad de solicitudes
        .slice(0, 3); // Tomar los 3 primeros
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


    let path = `products/${product.id}`
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
