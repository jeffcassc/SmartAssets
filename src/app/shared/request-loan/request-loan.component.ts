import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-request-loan',
  templateUrl: './request-loan.component.html',
  styleUrls: ['./request-loan.component.scss'],
})
export class RequestLoanComponent  implements OnInit {

  @Input() product: Product;

  form =new FormGroup({
    userName: new FormControl('', Validators.required),
    area: new FormControl('', Validators.required),
    duration: new FormControl('', [Validators.required, Validators.min(1)]),
    status: new FormControl('pendiente')

  })

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  ngOnInit() {
    
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      const requestData = {
        ...this.form.value,
        productId: this.product.id,
        productName: this.product.name,
        requestDate: new Date(),
      };

      this.firebaseSvc.addDocument('requests', requestData).then(() => {
        this.utilsSvc.dismissModal(true);
        this.utilsSvc.presentToast({
          message: 'Solicitud enviada exitosamente',
          color: 'success',
          duration: 2000,
        });
      }).catch((error) => {
        this.utilsSvc.presentToast({
          message: `Error al enviar la solicitud: ${error.message}`,
          color: 'danger',
          duration: 2000,
        });
      }).finally(() => loading.dismiss());
    }
  }
}
