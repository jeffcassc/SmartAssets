import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  @Input() product: Product;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product)  this.form.setValue(this.product)
      
    
  }

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.min(6)]),
    Image: new FormControl('', Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    contCode: new FormControl(null, [Validators.required, Validators.min(0)]),
    location: new FormControl('', Validators.required),  // Campo nuevo
    state: new FormControl('', Validators.required) ,
    borrowedBy: new FormControl('nadie')
    

  })

  //============= Tomar/Seleccionar imagen ==============
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.Image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();

    }

  }
  //=====convertir valores de tipo string a number ======
  //=====convertir valores de tipo string a number ======
  setNumberImputs(){
    let {price} = this.form.controls;

    
    if( price.value) price.setValue(parseFloat(price.value))
  }
  //=====================crear producto ======================
  async createProduct() {
    let path = `products`
    //para que se muetre la rueda de carga
    const loading = await this.utilsSvc.loading();
    await loading.present();

    //subir imagen y obtener url
    let dataUrl = this.form.value.Image;
    let imagepath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagepath, dataUrl);
    this.form.controls.Image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({
        success: true
      });
      this.utilsSvc.presentToast({
        message: 'Producto creado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })


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

    }).finally(() => {
      loading.dismiss(); //aqui finaliza la rueda de carga sin importa si lo de mas a sido correcto o no
    })
  }
  //============= actualizar producto==============
  async updateProduct() {


    let path = `products/${this.product.id}`
    //para que se muetre la rueda de carga
    const loading = await this.utilsSvc.loading();
    await loading.present();

    //subir imagen si el usuario la cambia y obtener url
    if (this.form.value.Image !== this.product.Image) {
      let dataUrl = this.form.value.Image;
      let imagepath = await this.firebaseSvc.getfilePath(this.product.Image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagepath, dataUrl);
      this.form.controls.Image.setValue(imageUrl);
    }


    delete this.form.value.id;

    this.firebaseSvc.UpdateDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({
        success: true
      });
      this.utilsSvc.presentToast({
        message: 'Producto actualizado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })


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

    }).finally(() => {
      loading.dismiss(); //aqui finaliza la rueda de carga sin importa si lo de mas a sido correcto o no
    })

  }
  

}
